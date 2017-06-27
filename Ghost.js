/*
Ghost prototype contains ghost constructor, render functions. Prototype for player and 
NPC ghosts.
*/

const Ghost = (function () {    
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');
  const module = {};


  module.create = function(X, Y, xSpeed, ySpeed, rightEye, leftEye) {

    this.hasRightEye = rightEye;
    this.hasLeftEye = leftEye;
    this.mood = 'happy';
    //start oscillation on a random index so they don't move in unison
    //moveIndex should be called oscillateIndex or something
    this.moveIndex = Math.floor(Math.random() * module.sinLookup.length);
    this.width = 50;
    this.height = 65;
    this.oscillationRate = 3;
    this.color = "rgba(255, 255, 255, 0.6)";

    this.position = {
      x : X,
      y : Y
    };

    this.getCenter = function () {
      return {
        x : this.position.x + this.width / 2,
        y : this.position.y + this.height / 2
      };      
    }

    this.getBoundingBox = function () {
      return {
        x : this.position.x,
        y : this.position.y,
        width : this.width,
        height : this.height 
      };
    };

    this.speed = {
      //pixels to move per frame; negative values change direction
      x : xSpeed,
      y : ySpeed
    };
  };

  module.render = function (ghost) {
    const x = ghost.position.x;
    const y = ghost.position.y;

    if (!(ctx.fillStyle = ghost.color)) {
      ctx.fillStyle = ghostColor;
    }

    //draw body
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x, y + 60);
    ctx.arc(x + 5, y + 60, 5, Math.PI, 0, true);
    ctx.arc(x + 15, y + 60, 5, Math.PI, 0, false);
    ctx.arc(x + 25, y + 60, 5, Math.PI, 0, true);
    ctx.arc(x + 35, y + 60, 5, Math.PI, 0, false);
    ctx.arc(x + 45, y + 60, 5, Math.PI, 0, true);
    ctx.moveTo(x + 0, y + 25);
    ctx.arc(x + 25, y + 25, 25, Math.PI, false);
    ctx.lineTo(x + 50, y + 60);
    ctx.fill();

    //draw eyes
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    if (ghost.hasLeftEye) {ctx.ellipse(x + 15, y + 24, 3, 6, 0, 0, 2 * Math.PI);}
    if (ghost.hasRightEye) {ctx.ellipse(x + 35, y + 24, 3, 6, 0, 0, 2 * Math.PI);}      
    ctx.fill();

    //draw mouth
    ctx.strokeStyle = '#1a1a1a';
    if (ghost.mood === 'happy') {
      ctx.beginPath();
      ctx.arc(x + 25, y - 7, 50, 7 * Math.PI / 12, 5 * Math.PI / 12, true);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x + 25, y + 93, 50, 17 * Math.PI / 12, 19 * Math.PI / 12, false);
      ctx.stroke();        
    }
  };

  module.sinLookup = (function(steps) {
    const lookup = [];
    let index = 0;
    for (i = 0; i <= Math.PI * 2; i+= Math.PI * 2 / steps) {
      //scale down to %25 or they look like they're bouncing
      lookup[index++] = Math.sin(i) * 0.25;
    }
    return lookup;
  })(180);

  return module;
}());
