var globalTime = 4.7;

//flowers
//syntax: (type,itMin,itMax,radius,start,scale,sWidth,sHeight,container,color,maxScale,timeLimit,timeMin,timeMax,timeMult,rotation)
flower('long',12,27,100,40,0,350,350,'container1',[0.2, 'navy', 0.5, 'blue', 0.8, 'pink', 1, 'white'],50,0.5,4000,300,600,1.5,10);
flower('rounded',6,12,100,25,0,350,350,'container2',[0.3, 'maroon', 0.6, 'red', 1, 'orange'],35,1,4000,450,700,1.5,30);
flower('pointed',8,16,100,35,0,350,350,'container3',[0.25, 'white', 0.65, '#ff5bc8', 1, '#5b003d'],18,0.75,4000,400,650,1.5,17);

//functions
function generatePedal(type,itterations,petalRadius,petalDistance,colors,randomness) {
  var rand = Math.floor(Math.random() * randomness);
  var width = petalRadius + rand;
  var height = (Math.sin((Math.PI*2)/(itterations + 0)) * (petalRadius + petalDistance));
  if (type === 'long') {
    var testPoints = [0, (height / 2), width, 0, (width * 2.4), (height / 2), width, height];
    var testTension = 0.4;
    var length = (width * 2.4);
  }
  else if (type === 'pointed') {
    var testPoints = [0, (height / 2), width, 0, (width * 1.2), ((height / 6) * 1), (width * 1.6), (height / 2), (width * 1.2), ((height / 6) * 5), width, height];
    var testTension = 0.5;
    var length = (width * 1.6);
  }
  else {
    var testPoints = [0, (height / 2), width, 0, width, height];
    var testTension = 0.5;
    var length = (width);
  }
  return new Konva.Line({
    points: testPoints,
    offset: { x: (petalDistance * -1), y: (height / 2) },
    fillLinearGradientStartPoint: { x: 0, y: (height / 2) },
    fillLinearGradientEndPoint: { x: length, y: (height / 2) },
    fillLinearGradientColorStops: colors,
    closed: true,
    shadowBlur: 100,
    shadowOpacity: 0.35,
    tension: testTension
  });
}

function addRing(type,itts,rad,dist,x,y,scale,colors,maxScale,timeLimit,maxRotate,randomness,stage) {
  var layer = new Konva.Layer();
  var arr = new Array();
  for (var i = 0; i < itts; i++) {
    var blob = generatePedal(type,itts,rad,dist,colors,randomness);
    blob.strokeHitEnabled(false);
    blob.rotate((360 / itts) * i);
    blob.setX(x);
    blob.setY(y);
    blob.scaleX(scale);
    blob.scaleY(scale);
    blob.it = i;
    layer.add(blob);
    arr.push(blob);
  }
  stage.add(layer);
  var anim = new Konva.Animation(function(frame) {
    var time = frame.time;
    var opacityFormant = (0.5 * Math.sin(((2*Math.PI)/timeLimit)*(time - (timeLimit / 4)))) + 0.5;
    for (var i = 0; i < arr.length; i++) {
      var node = arr[i];
      node.scale({ x : scale + ((maxScale - scale) * (time / timeLimit)), y : scale + ((maxScale - scale) * (time / timeLimit))});
      node.rotation(((360 / itts) * node.it) + (maxRotate * opacityFormant));
    }
    layer.opacity(opacityFormant);
    if ((time + 1) > timeLimit) {
      anim.stop();
      layer.destroy();
    }
  }, layer);
  anim.start();
}

function createBase(color,x,y,radius,timeLimit,stage) {
  var circle = new Konva.Circle({
    x: x,
    y: y,
    radius: radius,
    fill: color
  });
  var layer = new Konva.Layer();
  layer.add(circle);
  stage.add(layer);
  var anim = new Konva.Animation(function(frame) {
    var time = frame.time;
    layer.opacity((time / timeLimit));
    circle.scaleX((time / timeLimit));
    circle.scaleY((time / timeLimit));
    if ((time + 1) > timeLimit) {
      anim.stop();
    }
  }, layer);
  anim.start();
}

function flower(type,itMin,itMax,radius,start,scale,sWidth,sHeight,container,color,randomness,maxScale,timeLimit,timeMin,timeMax,timeMult,rotation) {
  //set the stage
  var stage = new Konva.Stage({
    container: container,
    width: sWidth,
    height: sHeight
  });
  x = (stage.width() / 2);
  y = (stage.height() / 2);
    timeLimit = timeLimit * timeMult * globalTime;
    timeMin = timeMin * timeMult * globalTime;
    timeMax = timeMax * timeMult * globalTime;
  createBase(color[1],x,y,start,timeLimit,stage);
  window.setInterval(function(){
    var itz = Math.floor((Math.random() * (itMax-itMin)) + 0.5) + itMin;
    addRing(type,itz,radius,start,x,y,scale,color,maxScale,timeLimit,rotation,randomness,stage);
  },(timeMin + (Math.random() * (timeMax - timeMin))));
}
