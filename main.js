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

function drawPoint(ctx, y) {            
  var radius = 3;
  ctx.beginPath();
  // Hold x constant at 4 so the point only moves up and down.
  ctx.arc(4, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
}
function plotSine(ctx, xOffset, yOffset) {
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var scale = 20;
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(66,44,255)";
  // console.log("Drawing point...");
  // drawPoint(ctx, yOffset+step);
  
  var x = 4;
  var y = 0;
  var amplitude = 40;
  var frequency = 20;
  //ctx.moveTo(x, y);
  //ctx.moveTo(x, 1);


  while (x < width) {
      y = height/2 + amplitude * Math.sin((x+xOffset)/frequency);
      ctx.lineTo(x, y);
      x++;
      // console.log("x="+x+" y="+y);
  }
  ctx.stroke();
  ctx.save();
  //console.log("Drawing point at y=" + y);
  //drawPoint(ctx, y);
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
  
  step += 4;
  //the animation:
  //window.requestAnimationFrame(draw);
}


function init() {
  draw();
  //init the animation:
  //window.requestAnimationFrame(draw);
  //spirograph();
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