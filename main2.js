
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
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

  //Draw black background
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  //Draw spectrum
  var barWidth = (canvas.width / bufferLength) * 2;
  var posX = 0;
  for (var i = 0; i < bufferLength; i++) {
    var barHeight = (dataArray[i]+130) * 2;
    canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
    canvasCtx.fillRect(posX, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    //space between bars
    posX += barWidth + 8;
    //posXarray.push(posX);
    //console.log("posX: " + posX);
  }
  //console.log("posXarray: " + posXarray);
};

//draw();