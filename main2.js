
//audioCtx is a constant
var audioCtx = new AudioContext();
//Create audio source
//The source is an audio file
//the audio element is a constant
var audioEle = new Audio();
audioEle.src = 'bye-bye-3.wav';//insert file name here
audioEle.autoplay = true;
audioEle.preload = 'auto';
//audioSourceNode is a constant
var audioSourceNode = audioCtx.createMediaElementSource(audioEle);

//when song ended finished the animation
audioEle.onended = function(event) {
  console.log("ended song!");
  cancelAnimationFrame(reqanimationreference);
}

var analyserNode;
var bufferLength;
var dataArray=[];
var minDec;
var maxDec;

var canvas;
var canvasCtx;
var reqanimationreference;

//Constant Values from wave
var wavequant;
var bufferLength;  
var barWidth;  
var posX;
var posX2;
var posY2;
var posY2Up;
var upValue

createAnalyserNode();

//Create analyser node
function createAnalyserNode(){
  console.log("in create analyser Node");
  analyserNode = audioCtx.createAnalyser();
  console.log("analyserNode: " , analyserNode);
  analyserNode.fftSize = 256;
  bufferLength = analyserNode.frequencyBinCount;
  console.log("bufferLength: " + bufferLength);
  minDec = analyserNode.minDecibels;
  maxDec = analyserNode.maxDecibels;
  console.log("minDec: " + minDec + "MaxDec: " + maxDec);
  dataArray = new Float32Array(bufferLength);
  //Set up audio node network
  audioSourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);
  createCanvas();
 
}

//Create 2D canvas
function createCanvas(){
  console.log("in create canvas");
  waveContainerDiv = document.getElementById('waveContainer'); 
  canvas = document.createElement('canvas');
  canvas.id = "wave";
  canvas.width = waveContainerDiv.offsetWidth;
  canvas.height = 600;
  console.log("canvas height: " + canvas.height + "canvas width: " + canvas.width);
  waveContainerDiv.appendChild(canvas);
  canvasCtx = canvas.getContext('2d');
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  //draw the canvas
  draw(); 
}


function mathClamp(min,mid,max){
  return Math.min(Math.max(min,mid),max)
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function drawReferenceLines(posY2Up, upValue){
  //reference lines 
    //up line
    canvasCtx.beginPath();
    canvasCtx.moveTo(0,posY2Up - upValue);
    canvasCtx.lineTo(canvas.width,posY2Up - upValue);
    canvasCtx.stroke();

    //down line
    canvasCtx.beginPath();
    canvasCtx.moveTo(0,posY2Up + upValue);
    canvasCtx.lineTo(canvas.width,posY2Up + upValue);
    canvasCtx.stroke();
    
}

function drawReferencePoints(posX, posX2, posY2, posY2Up, barWidth){
  //reference points:
    //draw the left corner  down point of every bar
    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fillRect(posX, posY2/2, barWidth/4, 5);

    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(posX2-4, posY2Up, barWidth/4, 5);
}

function drawMiddleLine(posY2Up, upValue){
  //middle line
  canvasCtx.beginPath();
  canvasCtx.moveTo(0,posY2Up);
  canvasCtx.lineTo(canvas.width, posY2Up);
  canvasCtx.stroke();
}

function drawHistogramBars(posX, posY, posYUp, barWidth, barHeight){
  canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
  //canvasCtx.fillRect(posX, posY, barWidth, barHeight / 2);
  canvasCtx.fillRect(posX, posYUp, barWidth, barHeight / 2);

}

function drawWave(ipx, ipy, cp1x, cp2x,  epx, epy, cpClaped){
  //normalize control  
  canvasCtx.lineWidth = 1;
  canvasCtx.strokeStyle = 'white';
  canvasCtx.beginPath();
  //initial point
  canvasCtx.moveTo(ipx, ipy);
  canvasCtx.bezierCurveTo(cp1x, cpClaped, cp2x, cpClaped, epx, epy);
  canvasCtx.stroke();
}

function setWaveValues(){
  //barWidth also can be used to set the numbers of waves 
  //wavequant: fixed number of waves
  wavequant = 11;
  bufferLength = wavequant;  
  barWidth = (canvas.width / bufferLength);  
  posX = 0;
  posX2 = posX + barWidth;
  posY2 = canvas.height - 5;
  posY2Up = canvas.height/2;
  //epsilon is kindda the amplitude
  //var epsilon = 20;
  epsilon = barWidth/4;
  upValue = canvas.height/4;
}


function draw() {
  //Schedule next redraw
  reqanimationreference = requestAnimationFrame(draw);

  //Get spectrum data
  analyserNode.getFloatFrequencyData(dataArray);

  //Draw black background
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  //Draw spectrum
  //set initial values
  setWaveValues();

  for (var i = 0; i < bufferLength; i++) {
    //normalize data
    //var normalizedDataArray = dataArray[i]+130;
    var normalizedDataArray = dataArray[i];
    var normalizedDataArray = mathClamp(minDec, normalizedDataArray, maxDec);
    //var barHeight = normalizedDataArray *(-10);
    //normalize the barHeight
    var barHeight = mathClamp(normalizedDataArray *(-8), normalizedDataArray*(-3) , normalizedDataArray *(-10));
    var posY = canvas.height - barHeight/2;
    //var upValue = canvas.height/4;
    var posYUp = posY - upValue;

    //draw histogram bars:
    //drawHistogramBars(posX, posY, posYUp, barWidth, barHeight);
    //reference points:
    //drawReferencePoints(posX, posX2, posY2, posY2Up, barWidth);
    
    //dotted lines:
    canvasCtx.setLineDash([1, 4]);/*dashes are 5px and spaces are 3px*/

    //drawReferenceLines(posY2Up, upValue);
    drawMiddleLine(posY2Up, upValue);

    //control points 
    var cp1x = posX+epsilon;
    var cp1y = posYUp;
    var cp2x = posX2 - epsilon;
    var cp2y = posYUp;


    //if even index then is the down wave
    if(i%2 === 0){
      //cpyAux2 is the clamp between middle and down reference lines
      var cpyAux2 = mathClamp(getRandom(0.55*canvas.height, 0.55*canvas.height + 10), posY, canvas.height);
      drawWave(posX, posY2Up, posX + epsilon, posX2 - epsilon, posX2, posY2Up, cpyAux2);
    }
    //if odd index then is the up wave 
    else{
      var cpyAux = mathClamp(posY2Up - upValue, posY - upValue, getRandom(posY2Up-30, posY2Up-45)); 
      drawWave(posX, posY2Up, posX + epsilon, posX2 - epsilon, posX2, posY2Up, cpyAux);

    }
    //space between bars
    posX += barWidth;
    posX2 += barWidth;

  }
  
  function handleResize() { 
    console.log("changed");
    cancelAnimationFrame(reqanimationreference);
    //canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    //draw();
  }

  //When rezise pause the animation
  window.addEventListener("resize", handleResize);

};
 