
//audioCtx is a constant
var audioCtx = new AudioContext();
//Create audio source
//The source is an audio file
//the audio element is a constant
var audioEle = new Audio();
audioEle.src = 'audio-sample.mp3';//insert file name here
audioEle.autoplay = true;
audioEle.preload = 'auto';
//audioSourceNode is a constant
var audioSourceNode = audioCtx.createMediaElementSource(audioEle);

var analyserNode;
var bufferLength;
var dataArray=[];

var canvas;
var canvasCtx;

createAnalyserNode();




//Create analyser node
function createAnalyserNode(){
  console.log("in create analyser Node");
  analyserNode = audioCtx.createAnalyser();
  console.log("analyserNode: " , analyserNode);
  analyserNode.fftSize = 256;
  bufferLength = analyserNode.frequencyBinCount;
  console.log("bufferLength " + bufferLength);
  dataArray = new Float32Array(bufferLength);

  dataSampleArray = new Float32Array(bufferLength);
  //Set up audio node network
  audioSourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);
  /*
  analyserNode.getFloatTimeDomainData(dataSampleArray);
  console.log("sampleValues: " + dataSampleArray);
  */
  createCanvas();
 
}

//Create 2D canvas
function createCanvas(){
  console.log("in create canvas");
  canvas = document.createElement('canvas');
  //canvas.style.position = 'absolute';
  //canvas.style.top = 0;
  //canvas.style.left = 0;
  /*
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  */
  canvas.width = 800;
  canvas.height = 600;
  console.log("canvas height: " + canvas.height + "canvas width: " + canvas.width);
  document.body.appendChild(canvas);
  canvasCtx = canvas.getContext('2d');
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  //draw the canvas
  draw();
  
}

 

//posX Array 
var posXarray=[];
//initialize
posXarray[0]=0;


function draw() {
  //Schedule next redraw
  requestAnimationFrame(draw);

  //Get spectrum data
  analyserNode.getFloatFrequencyData(dataArray);
  //console.log("datArray[0] en draw " + dataArray[0]);
  //analyserNode.getFloatTimeDomainData(dataSampleArray);
  //console.log("sampleValues: " + dataSampleArray.length);

  //Draw black background
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  //Draw spectrum
  //barWidth also can be used to set the numbers of waves 
  var barWidth = (canvas.width / bufferLength)*9;  
  var posX = 0;
  var posX2 = posX + barWidth;
  //console.log("BUFFER LENGTH: " + bufferLength + "barWidth: " + barWidth);
  var posY2 = canvas.height - 5;
  var posY2Up = canvas.height/2;
  //epsilon is kindda the amplitude
  var epsilon = 20;

  for (var i = 0; i < bufferLength; i++) {
    var normalizedDataArray = dataArray[i]+130;
    var barHeight = normalizedDataArray * 5;
    //var barHeight = (dataArray[i]+130) * 5;
    var posY = canvas.height - barHeight / 2;
    var posYUp = posY - 200;

    canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
    //canvasCtx.fillRect(posX, posY, barWidth, barHeight / 2);
    canvasCtx.fillRect(posX, posYUp, barWidth, barHeight / 2);
   
    //draw the left corner  down point of every bar
    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fillRect(posX, posY2/2, barWidth/4, 5);

    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(posX2-4, posY2Up, barWidth/4, 5);
    //bezier curves
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'white';
    canvasCtx.beginPath();
    //initial point
    canvasCtx.moveTo(posX, posY2Up);
    canvasCtx.bezierCurveTo(posX+epsilon, posYUp, posX2 - epsilon, posYUp, posX2, posY2Up);
    canvasCtx.stroke();


    //space between bars
    posX += barWidth + 8;

    posX2 += barWidth + 8;
    //posXarray.push(posX);
    //console.log("posX: " + posX);

    

  }
  //console.log("posXarray: " + posXarray);
};
 
//draw();