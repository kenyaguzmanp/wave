console.log("ready!");

function showAxes(ctx,axes) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var xMin = 0;
  
  ctx.beginPath();
  ctx.strokeStyle = "rgb(128,128,128)";
  
  // X-Axis
  ctx.moveTo(xMin, height/2);
  ctx.lineTo(width, height/2);
  
  // Y-Axis
  ctx.moveTo(width/2, 0);
  ctx.lineTo(width/2, height);
  // Starting line
  
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  
  ctx.stroke();
  
}

function plotSine(ctx, xOffset, yOffset) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var scale = 20;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(66,44,255)";

  //initial position of sin points
  var x = 4;
  var y = 0;
  //wave features
  var amplitude = 40;
  var frequency = 20;



  while (x < width) {
      y = height/2 + amplitude * Math.sin((x+xOffset)/frequency);
      ctx.lineTo(x, y);
      x++;
 
  }
  ctx.stroke();
  ctx.save();

  ctx.stroke();
  ctx.restore();
}


function draw() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, 500, 500);
  showAxes(context);
  context.save();            
  
  plotSine(context, step, 50);
  context.restore();
  
  //step: animation's speed
  step += 4;
  //the animation:
  //window.requestAnimationFrame(draw);
}


function init() {
  draw();
  //init the animation:
  //window.requestAnimationFrame(draw);
}
var step = -4;



/*
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  
  for(x=0; x<360; x += 20){
      ctx.moveTo(x+5,180);
      ctx.lineTo(x,180);
  }
  ctx.moveTo(0,180);
  
  for(x=0; x<=360*6; x+=1){
      y = 180.0 - Math.sin(x*Math.PI/180)*120;
      ctx.lineTo(x,y);
  }
  ctx.stroke();

  */

  soundFile = new Audio("audio-sample.mp3");

  //prefixed and non-prefixed AudioContext Instance
  //prefixed:  Webkit/Blink browsers
  //non-prefixed instance for Firefox (desktop/mobile/OS)
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();  
  //create an audio source
  var bufferSource = audioCtx.createBufferSource();
  console.log("buffer source: ", bufferSource);
  var mediaSource = audioCtx.createMediaElementSource(soundFile);
  console.log("mediaSource ", mediaSource);
  //create an analyser node
  var analyser = audioCtx.createAnalyser();
  console.log("analyser: ", analyser);
  //Connect the MediaElementSource
  mediaSource.connect(analyser);
  
  // frequencyBinCount tells you how many values you'll receive from the analyser
  var dataArray = new Uint8Array(analyser.frequencyBinCount); // Uint8Array should be the same length as the frequencyBinCount 

  // receive data
  // loop
  function renderFrame() {
    requestAnimationFrame(renderFrame);
    // update data in frequencyData
    analyser.getByteFrequencyData(dataArray);
    // render frame based on values in frequencyData
 }
 soundFile.play();
 renderFrame();
 console.log("dataArray: ", dataArray);
 console.log("type of dataArray: " , dataArray);

  /*
  function loadSound(soundFile){
    return axios.get(soundFile, {
      responseType: 'arraybuffer',
    });
  }*/