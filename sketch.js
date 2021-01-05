var audioContext; 
var mic;
var modeClassifier;
var s_ema,h_ema,p_ema,r_ema;
var ema_prob;
const EMA_N = 20;
const EMA_ALPHA = 2.0/(EMA_N+1);

var params;

const radius = 100;
const STEPS = 2000; //周長の数値積分の精度(最初の1度だけ使われる)
const SAMPLE_NUM = 512; //図形のサンプリングの細かさ(動作の重さに直結)
var xfreq0;
var xfreq1;
var xfreq2;
var xfreq3;
var xmixedfreq;
var yfreq0;
var yfreq1;
var yfreq2;
var yfreq3;
var ymixedfreq;

var xlist;
var ylist;

var xreflist;
var yreflist;

var FEATURE_NAME_RMS = 'rms';
var THRESHOLD_RMS = 0.005; // threshold on rms value
var SAMPLE_RATE = 44100;
var BUFFER_SIZE = 1024;
var cur_rms = 0;

var shape_r = 1.2;


function setup() {
  cv = createCanvas(1000,500);
  cv.parent('#wrapper');
  background(250);
  textAlign(CENTER,CENTER);
  textSize(40);
  noStroke();
  fill(0);
  text('Wait...',0,0,width,height);

  params = JSON.parse(sessionStorage.getItem('jsn_params'));

  if (params==null) {
    params = [30,0,0,1,0,0,
              21,0.38,0.85,6,0,0,
              23,0.5,1,6,0,0.24,
              17,0.45,0.87,6,0.96,1];
  }

  var res = sample_and_FFT_from_param(params[18],params[19],params[20],params[21],params[22],params[23]);
  xfreq0 = res.x_freq;
  yfreq0 = res.y_freq;
  res = sample_and_FFT_from_param(params[0],params[1],params[2],params[3],params[4],params[5]);
  xfreq1 = res.x_freq;
  yfreq1 = res.y_freq;
  res = sample_and_FFT_from_param(params[6],params[7],params[8],params[9],params[10],params[11]);
  xfreq2 = res.x_freq;
  yfreq2 = res.y_freq;
  res = sample_and_FFT_from_param(params[12],params[13],params[14],params[15],params[16],params[17]);
  xfreq3 = res.x_freq;
  yfreq3 = res.y_freq;

  xmixedfreq = new Array(SAMPLE_NUM);
  ymixedfreq = new Array(SAMPLE_NUM);
  for (let i=0; i<SAMPLE_NUM; i++) {
    xmixedfreq[i] = new Array(2).fill(0);
    ymixedfreq[i] = new Array(2).fill(0);
  }

  xreflist = ifft0(xfreq1).map(([r]) => shape_r*r);
  yreflist = ifft0(yfreq1).map(([r]) => shape_r*r);

  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startClassify);
  
  s_ema = 0;
  h_ema = 0;
  p_ema = 0;
  r_ema = 1.0;

  ema_prob = [0,0,0,1.0];

  onMicDataCall([FEATURE_NAME_RMS], show)
  .then((meydaAnalyzer) => {
      meydaAnalyzer.start();
  }).catch((err)=>{
      alert(err);
  });
}

function startClassify() {
  modeClassifier = new ModeClassifier('./models/A_special_model2', audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  getMode();
}

function getMode() {
  modeClassifier.getMode(function(err, res) {
    if (res!=null) {
      select('#result').html('マイクから1m程度離れて，A線の開放弦を弾いて下さい．<br>良い音が出ていると，フィードバック図形が目標図形と同じになります．');     
      background(250);
      mixfreq(xfreq0,xfreq1,xfreq2,xfreq3,ema_prob,xmixedfreq);
      mixfreq(yfreq0,yfreq1,yfreq2,yfreq3,ema_prob,ymixedfreq);
      xlist = ifft0(xmixedfreq).map(([r]) => shape_r*r);
      ylist = ifft0(ymixedfreq).map(([r]) => shape_r*r);
      translate(width*1.2/4,height/2);
      draw_from_samplingpoints(xlist,ylist);
      translate(-width*1.2/4,-height/2);
      translate(width*2.8/4,height/2);
      draw_from_samplingpoints(xreflist,yreflist);
      translate(-width*2.8/4,-height/2);
      textAlign(CENTER,BOTTOM);
      textSize(20);
      noStroke();
      fill(0);
      text('フィードバック図形',width*0.4/4,0,width*1.6/4,height-20);
      text('目標図形',width*2.0/4,0,width*1.6/4,height-20);
      //plotProb(ema_prob,0,1,600,100,300,300);

      if (cur_rms<THRESHOLD_RMS) {
        textAlign(CENTER,CENTER);
        textSize(40);
        noStroke();
        fill(255,0,0);
        text('No Sound Detected',0,0,width,height);
      }
      else {
        if (res.mode==1) {
          s_ema = calc_ema(0,s_ema);
          h_ema = calc_ema(1,h_ema);
          p_ema = calc_ema(0,p_ema);
          r_ema = calc_ema(0,r_ema);
        } else {
          s_ema = calc_ema(res.s,s_ema);
          h_ema = calc_ema(res.h,h_ema);
          p_ema = calc_ema(res.p,p_ema);
          r_ema = calc_ema(res.r,r_ema);
        }     
        var sumprob = s_ema+h_ema+p_ema+r_ema;
        if (sumprob>0) {
          ema_prob[0] = s_ema/sumprob;
          ema_prob[1] = h_ema/sumprob;
          ema_prob[2] = p_ema/sumprob;
          ema_prob[3] = r_ema/sumprob;
        }
      }
      //console.log(count);
      plotProb(ema_prob,0,1,100,100,800,300);
    }
    getMode(); //ここで再帰的に呼ぶことで、処理が繰り返される。
  });
}

function plotProb(arr,m,M,x,y,w,h) {
  N = arr.length;
  a = 3*h/(4*N+1);
  b = h/(4*N+1);
  stroke(0);
  noFill();
  translate(x,y);
  rect(0,0,w,h);
  for (let i=0; i<N; i++) {
    offy = b+(a+b)*i;
    offw = map(arr[i],m,M,0,w);
    fill('blue');
    rect(0,offy,offw,a);
  }
  translate(-x,-y);

}


function callCallback(promise, callback) {
  if (callback) {
    promise
      .then((result) => {
        callback(undefined, result);
        return result;
      })
      .catch((error) => {
        callback(error);
        return error;
      });
  }
  return promise;
}

class ModeClassifier {

  constructor(model, audioContext, stream, callback) {
    this.model = model;
    this.audioContext = audioContext;
    this.stream = stream;
    this.res = null;
    this.ready = callCallback(this.loadModel(model), callback);
  }

  async loadModel(model) {
    this.model = await tf.loadLayersModel(`${model}/model.json`);
    if (this.audioContext) {
      await this.processStream();
    } else {
      throw new Error('Could not access microphone - getUserMedia not available');
    }
    return this;
  }

  async processStream() {
    await tf.nextFrame();

    const mic = this.audioContext.createMediaStreamSource(this.stream);
    const minBufferSize = (this.audioContext.sampleRate / 16000) * 1024;
    let bufferSize = 4;
    while (bufferSize < minBufferSize) bufferSize *= 2;

    const scriptNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    scriptNode.onaudioprocess = this.processMicrophoneBuffer.bind(this);
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);

    mic.connect(scriptNode);
    scriptNode.connect(gain);
    gain.connect(this.audioContext.destination);

    if (this.audioContext.state !== 'running') {
      console.warn('User gesture needed to start AudioContext, please click');
    }
  }

  async processMicrophoneBuffer(event) {
    await tf.nextFrame();
    this.results = {};
    
    ModeClassifier.resample(event.inputBuffer, (resampled) => {
      tf.tidy(() => {
        this.running = true;
        const frame = tf.tensor(resampled.slice(0, 1024));
        const zeromean = tf.sub(frame, tf.mean(frame));
        const framestd = tf.tensor(tf.norm(zeromean).dataSync() / Math.sqrt(1024));
        const normalized = tf.div(zeromean, framestd);
        const input = normalized.reshape([1, 1024]);
        const activation = this.model.predict([input]).reshape([4]);
        const s = activation.dataSync()[0]; //確率最大になるindex
        const h = activation.dataSync()[1];
        const p = activation.dataSync()[2];
        const r = activation.dataSync()[3];
        const mode = activation.argMax().dataSync()[0]; //確率最大になるindex
        this.res = {'s':s,'h':h,'p':p,'r':r,'mode':mode};
      });
    });
  }

  async getMode(callback) {
    await this.ready;
    await tf.nextFrame();
    const { res } = this; //this.resをgetしているのと同義
    if (callback) {
      callback(undefined, res);
    }
    return res;
  }

  static resample(audioBuffer, onComplete) { //入力のaudioBufferをリサンプリング
    const interpolate = (audioBuffer.sampleRate % 16000 !== 0);
    const multiplier = audioBuffer.sampleRate / 16000;
    const original = audioBuffer.getChannelData(0);
    const subsamples = new Float32Array(1024);
    for (let i = 0; i < 1024; i += 1) {
      if (!interpolate) { //16000で割り切れるとき
        subsamples[i] = original[i * multiplier];
      } else { //16000で割り切れないとき
        const left = Math.floor(i * multiplier);
        const right = left + 1;
        const p = (i * multiplier) - left;
        subsamples[i] = (((1 - p) * original[left]) + (p * original[right]));
      }
    }
    onComplete(subsamples);
  }
}

function expi(theta) {return [Math.cos(theta), Math.sin(theta)];}
function iadd([ax, ay], [bx, by]) {return [ax + bx, ay + by];}
function isub([ax, ay], [bx, by]) {return [ax - bx, ay - by];}
function imul([ax, ay], [bx, by]) {return [ax * bx - ay * by, ax * by + ay * bx];}
function isum(cs) {return cs.reduce((s, c) => iadd(s, c), [0, 0]);}

function fftrec(c, T, N, s = 0, w = 1) {
    if (N === 1) return [c[s]];
    const Nh = N / 2, Td = T * 2, wd = w * 2;
    const rec = fftrec(c, Td, Nh, s, wd).concat(fftrec(c, Td, Nh, s + w, wd));
    for (let i = 0; i < Nh; i++) {
        const l = rec[i], re = imul(rec[i + Nh], expi(T * i));
        [rec[i], rec[i + Nh]] = [iadd(l, re), isub(l, re)];
    }
    return rec;
}

function fft0(f) {
    const N = f.length, T = -2 * Math.PI / N;
    return fftrec(f, T, N);
}
function ifft0(F) {
    const N = F.length, T = 2 * Math.PI / N;
    return fftrec(F, T, N).map(([r, i]) => [r / N, i / N]);
}

function draw_from_samplingpoints(x_array,y_array) {
    //サンプル点を描画する(直線で結ぶ)
    stroke(0);
    strokeWeight(1);
    fill(255);
    beginShape();

    for (let i = 0; i < x_array.length; i++) {
        x = x_array[i];
        y = y_array[i];
        vertex(x,y);
    }
    endShape(CLOSE);
    
}

function mixfreq(freq0, freq1, freq2, freq3, mixprob, mixedfreq) { 
  for (let i = 0; i < SAMPLE_NUM; i++) {
    for(let j = 0; j < 2; j++) {
      mixedfreq[i][j] = mixprob[0]*freq0[i][j]+mixprob[1]*freq1[i][j]+mixprob[2]*freq2[i][j]+mixprob[3]*freq3[i][j];
    }
  }
}

function calc_distarray(x1,y1,x2,y2,x3,y3,x4,y4,steps) {
  var l = 0;
  var pre_x = x1;
  var pre_y = y1;
  var cur_x = x1;
  var cur_y = y1;
  var distarray = [];
  //distarray[i]に始点からi番目の点までの道のりを格納
  //distarray[0] = 0, distarray[steps] = L
  for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      pre_x = cur_x;
      pre_y = cur_y;
      cur_x = bezierPoint(x1, x2, x3, x4, t);
      cur_y = bezierPoint(y1, y2, y3, y4, t);
      let dl = dist(pre_x, pre_y, cur_x, cur_y);
      l += dl;
      distarray.push(l);    
  }
  return distarray;
}

function calc_splitpoints(x1,y1,x2,y2,x3,y3,x4,y4,segmentL0,segmentL,distarray,steps) {
  //segmentL0:0番目のセグメントの長さ(始点から、最初のプロットまでの長さ)
  //segmentL:それ以降のプロット間隔
  var cur_segmentnum = 0;
  var pointsX = [];
  var pointsY = [];
  //rest:次に続くベジェ曲線におけるsegmentL0の長さ
  for (let j = 0; j < distarray.length; j++) {    
    if (distarray[j] >= segmentL * cur_segmentnum + segmentL0) {
      let X = bezierPoint(x1, x2, x3, x4, j/steps);
        let Y = bezierPoint(y1, y2, y3, y4, j/steps);
        pointsX.push(X);
        pointsY.push(Y);
        cur_segmentnum += 1;      
    }
  }
  var rest = segmentL0 + cur_segmentnum * segmentL - distarray[steps];
  return [pointsX,pointsY,rest];
}

function sample_and_FFT_from_param(num,amp,random_amp,random_seed,out_curv,inner_curv) {
  //図形パラメータからサンプル点をフーリエ変換した周波数領域の配列を返す。(0,0)を中心とする。

  randomSeed(random_seed);
  var t_random = random_amp;
  var r_random = random_amp;

  //頂点の位置を決めてから、間をベジェ曲線で結ぶ

  var points_r = Array(num*2);
  var points_theta = Array(num*2);

  //まずは、頂点の位置を決める
  for (var i = 0; i < 2*num; i++) {
    points_r[i] = radius * (1+amp*pow(-1,i)+r_random*random(-1,1)*0.4);
    points_theta[i] = PI*i/num - PI/2.0 + t_random*random(-1,1)*PI/(1.0*num);
  }

  var bezierpointlist = Array(num*2);//[i]に、i番目のベジェ曲線の4操作点のxy座標(8個)が入る
  var distarray_list = Array(num*2);//[i][j]にi番目のベジェ曲線について、始点からj番目のサンプル点までの距離が入る
  var x = points_r[0] * cos(points_theta[0]);
  var y = points_r[0] * sin(points_theta[0]);
  for (let j = 1; j <= 2*num; j++) {
    var k = j % (2*num);
    var pre_x4 = points_r[j-1] * cos(points_theta[j-1]);
    var pre_y4 = points_r[j-1] * sin(points_theta[j-1]);
    var x4 = points_r[k] * cos(points_theta[k]);
    var y4 = points_r[k] * sin(points_theta[k]); 
    var n1 = createVector(-pre_y4,pre_x4).normalize();
    var n2 = createVector(y4,-x4).normalize();  
    if (k%2==1) {
      var x2 = pre_x4 + 20*out_curv*n1.x;
      var y2 = pre_y4 + 20*out_curv*n1.y;
      var x3 = x4 + 20*inner_curv*n2.x;
      var y3 = y4 + 20*inner_curv*n2.y;
      bezierpointlist[j-1] = [pre_x4,pre_y4,x2,y2,x3,y3,x4,y4];
      distarray_list[j-1] = calc_distarray(pre_x4,pre_y4,x2,y2,x3,y3,x4,y4,STEPS);
    } else {
      var x5 = pre_x4 + 20*inner_curv*n1.x;
      var y5 = pre_y4 + 20*inner_curv*n1.y;
      var x6 = x4 + 20*out_curv*n2.x;
      var y6 = y4 + 20*out_curv*n2.y;
      bezierpointlist[j-1] = [pre_x4,pre_y4,x5,y5,x6,y6,x4,y4];
      distarray_list[j-1] = calc_distarray(pre_x4,pre_y4,x5,y5,x6,y6,x4,y4,STEPS);
    }       
  }
  //周長Lを計算
  var L = 0;
  for (let i = 0; i < distarray_list.length; i++) {
    L += distarray_list[i][STEPS];
  }
  //サンプリング間隔segmentLを計算
  var segmentL = L/SAMPLE_NUM;
  //サンプル点群samplingpointsを計算
  var rest = 0;
  var samplingX = [];
  var samplingY = [];
  for (let j = 0; j < distarray_list.length; j++) {
    let result = calc_splitpoints(bezierpointlist[j][0],bezierpointlist[j][1],bezierpointlist[j][2],bezierpointlist[j][3],bezierpointlist[j][4],
      bezierpointlist[j][5],bezierpointlist[j][6],bezierpointlist[j][7],rest,segmentL,distarray_list[j],STEPS);
    samplingX = samplingX.concat(result[0]);
    samplingY = samplingY.concat(result[1]);
    rest = result[2];
  }
  //時々サンプル点の数がSAMPLE_NUM+1になってしまうことがあるので、削減
  while (samplingX.length > SAMPLE_NUM) {
    samplingX.pop();
    samplingY.pop();
  }

  var x_freq = fft0(samplingX.map(r => [r, 0]));
  var y_freq = fft0(samplingY.map(r => [r, 0]));
  return {x_freq:x_freq,y_freq:y_freq};
}

function onMicDataCall(features, callback){
    return new Promise((resolve)=>{
            let audioCtx = getAudioContext();
            let analyzer = Meyda.createMeydaAnalyzer({
                'audioContext': audioCtx,
                'source':mic,
                'bufferSize':BUFFER_SIZE,
                'featureExtractors':features,
                'callback':callback,
                'sampleRate':SAMPLE_RATE
            });
            resolve(analyzer);
    });
}

function show(features){  //callback function
    cur_rms = features[FEATURE_NAME_RMS];
}

function calc_ema(new_data,ema_data) {
    return ema_data*(1-EMA_ALPHA) + new_data*EMA_ALPHA;
}

function OnButtonClick() {
  window.location.href = './change-shape';
}