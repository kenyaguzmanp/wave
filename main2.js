var audioCtx = new AudioContext();

//Create audio source
//Here, we use an audio file, but this could also be e.g. microphone input
var audioEle = new Audio();
audioEle.src = 'audio-sample.mp3';//insert file name here
audioEle.autoplay = true;
audioEle.preload = 'auto';
var audioSourceNode = audioCtx.createMediaElementSource(audioEle);

//Create analyser node
var analyserNode = audioCtx.createAnalyser();
analyserNode.fftSize = 256;
var bufferLength = analyserNode.frequencyBinCount;
console.log("bufferLength " + bufferLength);
var dataArray = new Float32Array(bufferLength);
console.log("dataArray: " , dataArray);

//Set up audio node network
audioSourceNode.connect(analyserNode);
analyserNode.connect(audioCtx.destination);

//Create 2D canvas
var canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
var canvasCtx = canvas.getContext('2d');
canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
console.log("canvas height: " + canvas.height);  

//posX Array 
var posXarray=[];
//initialize
posXarray[0]=0;
function draw() {
  //Schedule next redraw
  requestAnimationFrame(draw);

  //Get spectrum data
   analyserNode.getFloatFrequencyData(dataArray);


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
    posXarray.push(posX);
    //console.log("posX: " + posX);
  }
  console.log("posXarray: " + posXarray);
};

draw();