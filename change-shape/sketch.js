var slider_num1, slider_amp1, slider_random1, slider_seed1, slider_out_curv1, slider_inner_curv1;
var slider_num2, slider_amp2, slider_random2, slider_seed2, slider_out_curv2, slider_inner_curv2;
var slider_num3, slider_amp3, slider_random3, slider_seed3, slider_out_curv3, slider_inner_curv3;
var slider_num4, slider_amp4, slider_random4, slider_seed4, slider_out_curv4, slider_inner_curv4;
//var slider_mixrate;

var square_width,margin_width,margin_height,slider_width;
var square_margin;
var c1_x, c1_y, c2_x,c2_y, c3_x, c3_y, c4_x, c4_y;
var offsetslider;
var marginslider;

var num1,amp1,t_random1,r_random1,seed1,out_curv1,inner_curv1;
var num2,amp2,t_random2,r_random2,seed2,out_curv2,inner_curv2;
var num3,amp3,t_random3,r_random3,seed3,out_curv3,inner_curv3;
var num4,amp4,t_random4,r_random4,seed4,out_curv4,inner_curv4;

var params;


function setup() {
	params = JSON.parse(sessionStorage.getItem('jsn_params'));
	if (params==null) {
		params = [30,0,0,1,0,0,
			      21,0.38,0.85,6,0,0,
			      23,0.5,1,6,0,0.24,
				  17,0.45,0.87,6,0.96,1];
	}
	mycanvas = createCanvas(800,1800);
	mycanvas.parent('#wrapper');
	background(255);

	slider_num1 = createSlider(5,30,params[0],1);
	slider_num1.parent('#wrapper');
	slider_amp1 = createSlider(0,0.5,params[1],0.01);
	slider_amp1.parent('#wrapper');
	slider_random1 = createSlider(0,1,params[2],0.01);
	slider_random1.parent('#wrapper');
	slider_seed1 = createSlider(1,10,params[3],1);
	slider_seed1.parent('#wrapper');
	slider_out_curv1 = createSlider(0,1,params[4],0.01);
	slider_out_curv1.parent('#wrapper');
	slider_inner_curv1 = createSlider(0,1,params[5],0.01);
	slider_inner_curv1.parent('#wrapper');

	slider_num2 = createSlider(5,30,params[6],1);
	slider_num2.parent('#wrapper');
	slider_amp2 = createSlider(0,0.5,params[7],0.01);
	slider_amp2.parent('#wrapper');
	slider_random2 = createSlider(0,1,params[8],0.01);
	slider_random2.parent('#wrapper');
	slider_seed2 = createSlider(1,10,params[9],1);
	slider_seed2.parent('#wrapper');
	slider_out_curv2 = createSlider(0,1,params[10],0.01);
	slider_out_curv2.parent('#wrapper');
	slider_inner_curv2 = createSlider(0,1,params[11],0.01);
	slider_inner_curv2.parent('#wrapper');

	slider_num3 = createSlider(5,30,params[12],1);
	slider_num3.parent('#wrapper');
	slider_amp3 = createSlider(0,0.5,params[13],0.01);
	slider_amp3.parent('#wrapper');
	slider_random3 = createSlider(0,1,params[14],0.01);
	slider_random3.parent('#wrapper');
	slider_seed3 = createSlider(1,10,params[15],1);
	slider_seed3.parent('#wrapper');
	slider_out_curv3 = createSlider(0,1,params[16],0.01);
	slider_out_curv3.parent('#wrapper');
	slider_inner_curv3 = createSlider(0,1,params[17],0.01);
	slider_inner_curv3.parent('#wrapper');

	slider_num4 = createSlider(5,30,params[18],1);
	slider_num4.parent('#wrapper');
	slider_amp4 = createSlider(0,0.5,params[19],0.01);
	slider_amp4.parent('#wrapper');
	slider_random4 = createSlider(0,1,params[20],0.01);
	slider_random4.parent('#wrapper');
	slider_seed4 = createSlider(1,10,params[21],1);
	slider_seed4.parent('#wrapper');
	slider_out_curv4 = createSlider(0,1,params[22],0.01);
	slider_out_curv4.parent('#wrapper');
	slider_inner_curv4 = createSlider(0,1,params[23],0.01);
	slider_inner_curv4.parent('#wrapper');

	square_width = 300;
	margin_width = 250;
	margin_height = 150;
	slider_width = square_width/2;
	offsetslider = 10;
	w_offsetslider = 20;
	marginslider = 40;
	square_margin = min(100,square_width/5);

	c1_x = width/4;
	c1_y = square_width/2+80;
	c2_x = width/4;
	c2_y = c1_y+margin_height+square_width;
	c3_x = width/4;
	c3_y = c2_y+margin_height+square_width;
	c4_x = width/4;
	c4_y = c3_y+margin_height+square_width;
	
	slider_num1.position(c1_x+square_width/2+margin_width,c1_y-marginslider*3+offsetslider);
	slider_num1.size(slider_width);
	slider_amp1.position(c1_x+square_width/2+margin_width,c1_y-marginslider*2+offsetslider);
	slider_amp1.size(slider_width);
	slider_random1.position(c1_x+square_width/2+margin_width,c1_y-marginslider*1+offsetslider);
	slider_random1.size(slider_width);
	slider_seed1.position(c1_x+square_width/2+margin_width,c1_y+offsetslider);
	slider_seed1.size(slider_width);
	slider_out_curv1.position(c1_x+square_width/2+margin_width,c1_y+marginslider*1+offsetslider);
	slider_out_curv1.size(slider_width);
	slider_inner_curv1.position(c1_x+square_width/2+margin_width,c1_y+marginslider*2+offsetslider);
	slider_inner_curv1.size(slider_width);

	slider_num2.position(c2_x+square_width/2+margin_width,c2_y-marginslider*3+offsetslider);
	slider_num2.size(slider_width);
	slider_amp2.position(c2_x+square_width/2+margin_width,c2_y-marginslider*2+offsetslider);
	slider_amp2.size(slider_width);
	slider_random2.position(c2_x+square_width/2+margin_width,c2_y-marginslider*1+offsetslider);
	slider_random2.size(slider_width);
	slider_seed2.position(c2_x+square_width/2+margin_width,c2_y+offsetslider);
	slider_seed2.size(slider_width);
	slider_out_curv2.position(c2_x+square_width/2+margin_width,c2_y+marginslider*1+offsetslider);
	slider_out_curv2.size(slider_width);
	slider_inner_curv2.position(c2_x+square_width/2+margin_width,c2_y+marginslider*2+offsetslider);
	slider_inner_curv2.size(slider_width);

	slider_num3.position(c3_x+square_width/2+margin_width,c3_y-marginslider*3+offsetslider);
	slider_num3.size(slider_width);
	slider_amp3.position(c3_x+square_width/2+margin_width,c3_y-marginslider*2+offsetslider);
	slider_amp3.size(slider_width);
	slider_random3.position(c3_x+square_width/2+margin_width,c3_y-marginslider*1+offsetslider);
	slider_random3.size(slider_width);
	slider_seed3.position(c3_x+square_width/2+margin_width,c3_y+offsetslider);
	slider_seed3.size(slider_width);
	slider_out_curv3.position(c3_x+square_width/2+margin_width,c3_y+marginslider*1+offsetslider);
	slider_out_curv3.size(slider_width);
	slider_inner_curv3.position(c3_x+square_width/2+margin_width,c3_y+marginslider*2+offsetslider);
	slider_inner_curv3.size(slider_width);

	slider_num4.position(c4_x+square_width/2+margin_width,c4_y-marginslider*3+offsetslider);
	slider_num4.size(slider_width);
	slider_amp4.position(c4_x+square_width/2+margin_width,c4_y-marginslider*2+offsetslider);
	slider_amp4.size(slider_width);
	slider_random4.position(c4_x+square_width/2+margin_width,c4_y-marginslider*1+offsetslider);
	slider_random4.size(slider_width);
	slider_seed4.position(c4_x+square_width/2+margin_width,c4_y+offsetslider);
	slider_seed4.size(slider_width);
	slider_out_curv4.position(c4_x+square_width/2+margin_width,c4_y+marginslider*1+offsetslider);
	slider_out_curv4.size(slider_width);
	slider_inner_curv4.position(c4_x+square_width/2+margin_width,c4_y+marginslider*2+offsetslider);
	slider_inner_curv4.size(slider_width);
	select('.sound1').position(c1_x-80,c1_y-square_width/2-50);
	select('.sound2').position(c2_x-80,c2_y-square_width/2-50);
	select('.sound3').position(c3_x-80,c3_y-square_width/2-50);
	select('.sound4').position(c4_x-80,c4_y-square_width/2-50);

}

function draw() {
	background(255);

	num1 = slider_num1.value(); //角の本数(辺は2*num本)
	amp1 = slider_amp1.value();
	t_random1 = slider_random1.value();
	r_random1 = slider_random1.value();
	seed1 = slider_seed1.value();
	out_curv1 = slider_out_curv1.value();
	inner_curv1 = slider_inner_curv1.value();

	num2 = slider_num2.value(); //角の本数(辺は2*num本)
	amp2 = slider_amp2.value();
	t_random2 = slider_random2.value();
	r_random2 = slider_random2.value();
	seed2 = slider_seed2.value();
	out_curv2 = slider_out_curv2.value();
	inner_curv2 = slider_inner_curv2.value();

	num3 = slider_num3.value(); //角の本数(辺は2*num本)
	amp3 = slider_amp3.value();
	t_random3 = slider_random3.value();
	r_random3 = slider_random3.value();
	seed3 = slider_seed3.value();
	out_curv3 = slider_out_curv3.value();
	inner_curv3 = slider_inner_curv3.value();
	
	num4 = slider_num4.value(); //角の本数(辺は2*num本)
	amp4 = slider_amp4.value();
	t_random4 = slider_random4.value();
	r_random4 = slider_random4.value();
	seed4 = slider_seed4.value();
	out_curv4 = slider_out_curv4.value();
	inner_curv4 = slider_inner_curv4.value();

	var radius = square_width/4;
	var steps = 2000;
	var splitnum = 512; //これは2のべき乗である必要あり

	translate(c1_x,c1_y);
	stroke(0);
	noFill();
	rect(-square_width/2,-square_width/2,square_width,square_width);
	draw_from_param(radius,num1,amp1,t_random1,r_random1,seed1,out_curv1,inner_curv1);
	translate(-c1_x,-c1_y);

	translate(c2_x,c2_y);
	stroke(0);
	noFill();
	rect(-square_width/2,-square_width/2,square_width,square_width);
	draw_from_param(radius,num2,amp2,t_random2,r_random2,seed2,out_curv2,inner_curv2);
	translate(-c2_x,-c2_y);

	translate(c3_x,c3_y);
	stroke(0);
	noFill();
	rect(-square_width/2,-square_width/2,square_width,square_width);
	draw_from_param(radius,num3,amp3,t_random3,r_random3,seed3,out_curv3,inner_curv3);
	translate(-c3_x,-c3_y);

	translate(c4_x,c4_y);
	stroke(0);
	noFill();
	rect(-square_width/2,-square_width/2,square_width,square_width);
	draw_from_param(radius,num4,amp4,t_random4,r_random4,seed4,out_curv4,inner_curv4);
	translate(-c4_x,-c4_y);

	noStroke();
	fill(0);
	textSize(20);
	textStyle(NORMAL);
	textAlign("right");
	text("ツノの本数",c1_x+square_width/2+margin_width-w_offsetslider,c1_y-marginslider*3+20+offsetslider);
	text("ツノの長さ",c1_x+square_width/2+margin_width-w_offsetslider,c1_y-marginslider*2+20+offsetslider);
	text("ランダムの度合い",c1_x+square_width/2+margin_width-w_offsetslider,c1_y-marginslider*1+20+offsetslider);
	text("ランダムのさせ方",c1_x+square_width/2+margin_width-w_offsetslider,c1_y+20+offsetslider);
	text("ツノの先端の鋭さ",c1_x+square_width/2+margin_width-w_offsetslider,c1_y+marginslider*1+20+offsetslider);
	text("ツノの付け根の鋭さ",c1_x+square_width/2+margin_width-w_offsetslider,c1_y+marginslider*2+20+offsetslider);
	
	text("ツノの本数",c2_x+square_width/2+margin_width-w_offsetslider,c2_y-marginslider*3+20+offsetslider);
	text("ツノの長さ",c2_x+square_width/2+margin_width-w_offsetslider,c2_y-marginslider*2+20+offsetslider);
	text("ランダムの度合い",c2_x+square_width/2+margin_width-w_offsetslider,c2_y-marginslider*1+20+offsetslider);
	text("ランダムのさせ方",c2_x+square_width/2+margin_width-w_offsetslider,c2_y+20+offsetslider);
	text("ツノの先端の鋭さ",c2_x+square_width/2+margin_width-w_offsetslider,c2_y+marginslider*1+20+offsetslider);
	text("ツノの付け根の鋭さ",c2_x+square_width/2+margin_width-w_offsetslider,c2_y+marginslider*2+20+offsetslider);
	
	text("ツノの本数",c3_x+square_width/2+margin_width-w_offsetslider,c3_y-marginslider*3+20+offsetslider);
	text("ツノの長さ",c3_x+square_width/2+margin_width-w_offsetslider,c3_y-marginslider*2+20+offsetslider);
	text("ランダムの度合い",c3_x+square_width/2+margin_width-w_offsetslider,c3_y-marginslider*1+20+offsetslider);
	text("ランダムのさせ方",c3_x+square_width/2+margin_width-w_offsetslider,c3_y+20+offsetslider);
	text("ツノの先端の鋭さ",c3_x+square_width/2+margin_width-w_offsetslider,c3_y+marginslider*1+20+offsetslider);
	text("ツノの付け根の鋭さ",c3_x+square_width/2+margin_width-w_offsetslider,c3_y+marginslider*2+20+offsetslider);
	
	text("ツノの本数",c4_x+square_width/2+margin_width-w_offsetslider,c4_y-marginslider*3+20+offsetslider);
	text("ツノの長さ",c4_x+square_width/2+margin_width-w_offsetslider,c4_y-marginslider*2+20+offsetslider);
	text("ランダムの度合い",c4_x+square_width/2+margin_width-w_offsetslider,c4_y-marginslider*1+20+offsetslider);
	text("ランダムのさせ方",c4_x+square_width/2+margin_width-w_offsetslider,c4_y+20+offsetslider);
	text("ツノの先端の鋭さ",c4_x+square_width/2+margin_width-w_offsetslider,c4_y+marginslider*1+20+offsetslider);
	text("ツノの付け根の鋭さ",c4_x+square_width/2+margin_width-w_offsetslider,c4_y+marginslider*2+20+offsetslider);

	textStyle(BOLD);
	textAlign("right");
	text("音１",c1_x-90,c1_y-square_width/2-25);
	text("音２",c2_x-90,c2_y-square_width/2-25);
	text("音３",c3_x-90,c3_y-square_width/2-25);
	text("音４",c4_x-90,c4_y-square_width/2-25);

	textAlign("center");
	text("図形１(この図形が目標図形になります)",c1_x,c1_y+square_width/2+40);
	text("図形２",c2_x,c2_y+square_width/2+40);
	text("図形３",c3_x,c3_y+square_width/2+40);
	text("図形４",c4_x,c4_y+square_width/2+40);

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

function calc_magnitude(freq) {
	let magnitude = [];
	let tmp;
	for (let i = 0; i < freq.length; i++) {
		tmp = freq[i][0]*freq[i][0]+freq[i][1]*freq[i][1];
		magnitude.push(tmp);
	}
	return magnitude;
}

function draw_from_param(radius,num,amp,t_random,r_random,random_seed,out_curv,inner_curv) {

	randomSeed(random_seed);

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

	stroke(0);
	strokeWeight(1);
	noFill();
	beginShape();
	var x = points_r[0] * cos(points_theta[0]);
 	var y = points_r[0] * sin(points_theta[0]);
	vertex(x,y);
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
			bezierVertex(x2,y2,x3,y3,x4,y4);
		} else {
			var x5 = pre_x4 + 20*inner_curv*n1.x;
			var y5 = pre_y4 + 20*inner_curv*n1.y;
			var x6 = x4 + 20*out_curv*n2.x;
			var y6 = y4 + 20*out_curv*n2.y;
			bezierVertex(x5,y5,x6,y6,x4,y4);
		}				
	}
	endShape(CLOSE);
}

function draw_from_samplingpoints(x_array,y_array) {
	//サンプル点を描画する(直線で結ぶ)
	stroke(0);
	strokeWeight(1);
	noFill();
	beginShape();

	for (let i = 0; i < x_array.length; i++) {
		x = x_array[i];
		y = y_array[i];
		vertex(x,y);
	}
	endShape();
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

function mixfreq(freq1, freq2, mixrate) {
	var freq = new Array(freq1.length);
	for(let y = 0; y < freq.length; y++) {
  		freq[y] = new Array(freq1[y].length).fill(0);
	}
	for (let i = 0; i < freq1.length; i++) {
		for(let j = 0; j < freq1[i].length; j++) {
			freq[i][j] = (1-mixrate)*freq1[i][j]+mixrate*freq2[i][j];
		}
	}
	return freq;
}

function OnButtonClick(){
	params = [num1,amp1,t_random1,seed1,out_curv1,inner_curv1,
		      num2,amp2,t_random2,seed2,out_curv2,inner_curv2,
		      num3,amp3,t_random3,seed3,out_curv3,inner_curv3,
		      num4,amp4,t_random4,seed4,out_curv4,inner_curv4];

	var jsn_params = JSON.stringify(params);
	sessionStorage.setItem('jsn_params',jsn_params);
	window.location.href = '../';
}
