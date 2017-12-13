
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
var minDec;
var maxDec;

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
  minDec = analyserNode.minDecibels;
  maxDec = analyserNode.maxDecibels;
  console.log("minDec: " + minDec + "MaxDec: " + maxDec);
  dataArray = new Float32Array(bufferLength);

  dataSampleArray = new Float32Array(bufferLength);
  //Set up audio node network
  audioSourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);
  /*
  analyserNode.getFloatFrequencyData(dataSampleArray);
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

function mathClamp(min,mid,max){
  return Math.min(Math.max(min,mid),max)
}




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
    //normalize data
    //var normalizedDataArray = dataArray[i]+130;
    var normalizedDataArray = dataArray[i];
    var normalizedDataArray = mathClamp(minDec, dataArray[i], maxDec);
    //var barHeight = normalizedDataArray *(-10);
    //normalize the barHeight
    var barHeight = mathClamp(normalizedDataArray *(-8), normalizedDataArray*(-3) , normalizedDataArray *(-10));
    var posY = canvas.height - barHeight/2;
    var upValue = canvas.height/4;
    var posYUp = posY - upValue;
    //bars:
    canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
    //canvasCtx.fillRect(posX, posY, barWidth, barHeight / 2);
    canvasCtx.fillRect(posX, posYUp, barWidth, barHeight / 2);
   
    //reference points:
    //draw the left corner  down point of every bar
    /*
    canvasCtx.fillStyle = 'yellow';
    canvasCtx.fillRect(posX, posY2/2, barWidth/4, 5);

    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(posX2-4, posY2Up, barWidth/4, 5);
    */

    

    //dotted lines:
    canvasCtx.setLineDash([1, 4]);/*dashes are 5px and spaces are 3px*/
   // canvasCtx.beginPath();
   // canvasCtx.moveTo(0,100);
  //  canvasCtx.lineTo(400, 100);
   // canvasCtx.stroke();  

    //reference lines 
    //middle line
    canvasCtx.beginPath();
    canvasCtx.moveTo(0,posY2Up);
    canvasCtx.lineTo(canvas.width, posY2Up);
    canvasCtx.stroke();

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


    //control points 
    var cp1x = posX+epsilon;
    var cp1y = posYUp;
    var cp2x = posX2 - epsilon;
    var cp2y = posYUp;

    //if even index then is the down wave
    if(i%2 === 0){
      canvasCtx.fillStyle = 'green';
      canvasCtx.fillRect(posX2-4, posY2Up - upValue, barWidth/4, 5);

      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = 'white';
      canvasCtx.beginPath();
      //initial point
      canvasCtx.moveTo(posX, posY2Up);
      canvasCtx.bezierCurveTo(cp1x, cp1y + upValue , cp2x, cp2y + upValue, posX2, posY2Up);
      canvasCtx.stroke();  

    }
    //if odd index then is the up wave 
    else{
      //bezier curves
      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = 'white';
      canvasCtx.beginPath();
      //initial point
      canvasCtx.moveTo(posX, posY2Up);
      canvasCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, posX2, posY2Up);
      canvasCtx.stroke();
    }

    //space between bars
    posX += barWidth;
    posX2 += barWidth;

    

  }
  
};
 
//draw();