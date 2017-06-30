/*
Holds all player related logic AND the player object in use?
*/
const Player = (function() {
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');
  const module = {};

  const player = (function() {
    //create basic ghost with base parameters
    const p = new Ghost.create(
          40 + Math.random() * (canvas.width - 40),
          canvas.height / 2 + Math.random() * (canvas.height / 2),
          0, 
          0, 
          (Math.random() < 0.1 ? false : true),
          (Math.random() < 0.1 ? false : true));
    
    //now add p-specific parameters
    p.color = "rgba(255, 200, 200, 0.6)";

    p.influenceDistance = 50;
    
    p.input = {
        left : false,
        right : false,
        up : false,
        down : false
      };

    p.maxSpeed = 0.5;
    
    p.speedIncrement = 0.01;

    p.getInfluenceBox = function () {
      return {
      x: this.position.x - this.influenceDistance,
      y: this.position.y - this.influenceDistance,
      width: this.width + this.influenceDistance * 2,
      height: this.height + this.influenceDistance * 2
      };
    };

    p.updateSpeed = function () {
      if (this.input.left) {
        this.speed.x -= this.speedIncrement;
      } else if (this.input.right) {
        this.speed.x += this.speedIncrement;
      } else {
        this.speed.x *= 0.995;
      }

      if (this.input.up) {
        this.speed.y -= this.speedIncrement;
      } else if (this.input.down) {
        this.speed.y += this.speedIncrement;
      } else {
        this.speed.y *= 0.995;
      }
    }  

    p.move = function() {
      //set new position, referenced to current position in pixels
      this.position.x += this.speed.x;
      //TODO: investigate that dubious *.25  
      this.position.y += this.speed.y + (Ghost.sinLookup[this.moveIndex++ % Ghost.sinLookup.length]);

      if (++this.moveIndex === Ghost.sinLookup.length) {
        this.moveIndex = 0;
      }
    };

    p.checkWallCollisions = function () {
      const pb = p.getBoundingBox();
      const collisions = Util.detectWallCollision(pb);

      if (collisions.left) {
        p.position.x = Box.walls.left.x + Box.walls.left.width;
        p.speed.x = 0;
      }
      if (collisions.right) {
        p.position.x = Box.walls.right.x - pb.width;
        p.speed.x = 0;
      }
      if (collisions.bottom) {
        p.position.y = Box.walls.bottom.y - pb.height;
        p.speed.y = 0;
      }
      if (collisions.top) {
        p.position.y = Box.walls.top.left.y + Box.walls.top.left.height;
        p.speed.y = 0;
      }
      //special case- player isn't allowed to exit out fan hole
      if (pb.y < 0) {
        p.position.y = 0;
        p.speed.y = 0;        
      }                  
    }

    document.addEventListener('keydown', function(event) {
      event.preventDefault();

      switch (event.keyCode) {
        case 37:
          p.input.left = true;
          break;
        case 38:
          p.input.up = true;
          break;
        case 39:
          p.input.right = true;
          break;
        case 40: 
          p.input.down = true;
          break;
      }
    });

    document.addEventListener('keyup', function(event) {
      event.preventDefault();

      switch (event.keyCode) {
        case 37:
          p.input.left = false;
          break;
        case 38:
          p.input.up = false;
          break;
        case 39:
          p.input.right = false;
          break;
        case 40: 
          p.input.down = false;
          break;
      }
    });

    return p;
  })();

  module.player = player;
  
  module.showDebug = function () {
    ctx.strokeStyle = 'rgb(255, 100, 100)';
    ctx.beginPath();
    ctx.rect(player.getInfluenceBox().x, player.getInfluenceBox().y,
             player.getInfluenceBox().width , player.getInfluenceBox().height);
    ctx.strokeText('x: ' + player.getInfluenceBox().x.toPrecision(2) + ' y: ' + player.getInfluenceBox().y.toPrecision(2), player.position.x, player.position.y);
    ctx.stroke();
    ctx.strokeStyle = '#1a1a1a';     
  }

  module.updateAndRender = function () {
    player.updateSpeed();
    player.move();
    player.checkWallCollisions();
    Ghost.render(player);
  }



  return module;

})();