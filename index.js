function draw() {
  let ctx;

  const canvas = document.getElementById('boxCanvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }

  const fan = (function (X, Y, CTX) {
    const fan = {};

    let on = false;
    const ctx = CTX;
    const x = X;
    const y = Y;
    const width = 200;
    const height = 200;

    fan.isOn = function () {
      return on;
    }

    fan.setOn = function (newState) {
      on = newState;
    }

    fan.getBounds = function () {
      return {
        x : x,
        y : y,
        width : width,
        height : height
      }
    }

    fan.render = function () {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.stroke();
    }

    return fan;
  })(0, 0, ctx);

  const Ghosts = (function (numGhosts, ctx) {    
    const module = {};

    const oscillationRate = 3;  //cycles per second
    const sinLookup = (function(steps) {
      const lookup = [];
      let index = 0;
      for (i = 0; i <= Math.PI * 2; i+= Math.PI * 2 / steps) {
        lookup[index++] = Math.sin(i);
      }
      return lookup;
    })(oscillationRate * 60);

    const ghostArray = [];
    const ghostColor = "rgba(255, 255, 255, 0.6)";


    const moveGhost = function (ghost) {
      //set new position, referenced to current position in pixels
      ghost.position.x += ghost.speed.x;
      //TODO: what's that *.25 do??? Some scaling value? Sheesh.
      ghost.position.y += ghost.speed.y + (sinLookup[ghost.moveIndex++ % sinLookup.length]) * .25;
      //don't update player destination
      if (ghost.destination){
        if ((Math.abs(ghost.destination.x - ghost.position.x) < 10) && (Math.abs(ghost.destination.y - ghost.position.y) < 10)) {
          ghost.destination.x = Math.random() * (canvas.width - 50);
          ghost.destination.y = canvas.height / 3 + Math.random() * canvas.height * 0.66 - 40;
        }
      }
      if (++ghost.moveIndex === sinLookup.length) {
        ghost.moveIndex = 0;
      }
    };

    const updateSpeed = function (ghost) {
      const destinationSpeed = {
        x : 0,
        y : 0        
      };
      
      const avoidPlayerSpeed = {
        x : 0,
        y : 0
      };

      destinationSpeed.x = 0.0001 * (ghost.destination.x - ghost.position.x);
      destinationSpeed.y = 0.0001 * (ghost.destination.y - ghost.position.y) 

      if ((Math.abs(player.position.x - ghost.position.x) < 100) && (Math.abs(player.position.y - ghost.position.y) < 100)) {
        avoidPlayerSpeed.x = 0.001 * (player.position.x - ghost.position.x);
        avoidPlayerSpeed.y = 0.001 * (player.position.y - ghost.position.y);
      }

      avoidPlayerSpeed.x = Math.abs(avoidPlayerSpeed.x) > 0.2
                      ? Math.sign(avoidPlayerSpeed.x) * 0.2
                      : avoidPlayerSpeed.x;

      avoidPlayerSpeed.y = Math.abs(avoidPlayerSpeed.y) > 0.2
                      ? Math.sign(avoidPlayerSpeed.y) * 0.2
                      : avoidPlayerSpeed.y;

      destinationSpeed.x = Math.abs(destinationSpeed.x) > 0.2
                      ? Math.sign(destinationSpeed.x) * 0.2
                      : destinationSpeed.x;

      destinationSpeed.y = Math.abs(destinationSpeed.y) > 0.2
                      ? Math.sign(destinationSpeed.y) * 0.2
                      : destinationSpeed.y;

      ghost.speed.x += destinationSpeed.x - avoidPlayerSpeed.x;
      ghost.speed.y += destinationSpeed.y - avoidPlayerSpeed.y;

      ghost.speed.x = Math.abs(ghost.speed.x) > 0.3
                      ? Math.sign(ghost.speed.x) * 0.3
                      : ghost.speed.x;

      ghost.speed.y = Math.abs(ghost.speed.y) > 0.3
                      ? Math.sign(ghost.speed.y) * 0.3
                      : ghost.speed.y;

    };

    const updatePlayerSpeed = function () {
      if (player.input.left) {
        player.speed.x -= player.speedIncrement;
      } else if (player.input.right) {
        player.speed.x += player.speedIncrement;
      } else {
        player.speed.x *= 0.995;
      }

      if (player.input.up) {
        player.speed.y -= player.speedIncrement;
      } else if (player.input.down) {
        player.speed.y += player.speedIncrement;
      } else {
        player.speed.y *= 0.995;
      }

    }            
//TODO: this works with ghost collisions, but not with the fan
    const checkCollision = function (aX, aY, aWidth, aHeight, bX, bY, bWidth, bHeight) {
      if ((Math.abs(aX - bX) < aWidth / 2 + bWidth / 2) &&
          (Math.abs(aY - bY) < aHeight / 2 + bHeight / 2)) {
        return true;
      }
      return false;
    }

    const checkCollisionWithFan = function () {
      let fanCollision = false;
      ghostArray.forEach(function checkFanCollision(g) {
        if (checkCollision(0, 0,
                           200, 200,
                           g.position.x, g.position.y,
                           g.size.width, g.size.height)) {
          console.log('fan collision');
          fanCollision = true;
          g.mood = 'sad';
          g.speed.y -= 1;
        }
      });
      if (fanCollision) {
        //send fan command to server
      }
    }

    const checkCollisionWithPlayer = function () {
      let playerCollision = false;
      ghostArray.forEach(function checkPlayerCollision(g) {
        if (checkCollision(player.position.x, player.position.y,
                           player.size.width + 20, player.size.height + 20,
                           g.position.x, g.position.y,
                           g.size.width, g.size.height)) {
          g.mood = 'sad';
          playerCollision = true;
        } else {
          g.mood = 'happy';
        }
      });
      if (playerCollision) {
        player.mood = 'happy';
      } else {
        player.mood = 'sad';
      }
    }

    const checkCollisions = function (ghost) {
      //check for collision with walls
      if (ghost.position.x >= canvas.width - ghost.size.width) {
        ghost.speed.x = 0;
        ghost.position.x = canvas.width - ghost.size.width;
      }
      if (ghost.position.x <= 0) {
        ghost.speed.x = 0;
        ghost.position.x = 0;
      }
      if (ghost.position.y >= canvas.height - ghost.size.height) {
        ghost.speed.y = 0;
        ghost.position.y = canvas.height - ghost.size.height;
      }
      if (ghost.position.y <= 0) {
        ghost.speed.y = 0;
        ghost.position.y = 0;
      }
    }

    const drawGhost = function (ghost) {
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


    const createNewGhost = function(X, Y, xSpeed, ySpeed, rightEye, leftEye) {
      const ghost = {
        hasRightEye : rightEye,
        hasLeftEye : leftEye,
        mood : 'happy',
        moveIndex : Math.floor(Math.random() * sinLookup.length),
        
        size : {
          width : 50,
          height : 65
        },

        //set position()

        position : {
          x : X,
          y : Y
        },

        get center() {return {
          x : this.position.x + this.size.width / 2, 
          y : this.position.y + this.size.height / 2}
        },

        speed : {
          //pixels to move per frame; negative values change direction
          x : xSpeed,
          y : ySpeed
        },
        
        destination : {
          x : Math.random() * canvas.width,
          y : Math.random() * canvas.height
        }
      }
      return ghost;
    }

    const createPlayer = function (X, Y, rightEye, leftEye) {
      const player = {
        player : true,
        hasRightEye : rightEye,
        hasLeftEye : leftEye,
        color : 'rgba(255, 220, 220, 0.6)',
        maxSpeed : (30 / 60),
        speedIncrement : 0.01,
        mood : 'happy',
        moveIndex : Math.floor(Math.random() * sinLookup.length),
        
        input : {
          left : false,
          right : false,
          up : false,
          down : false
        },

        size : {
          width : 50,
          height : 65
        },
        
        get center() {return {
          x : this.position.x + this.size.width / 2, 
          y : this.position.y + this.size.height / 2}
        },

        position : {
          x : X,
          y : Y
        },
        
        speed : {
          //pixels to move per frame; negative values change direction
          x : 0,
          y : 0
        }
      }
      return player;
    }


    for (let i = 0; i < numGhosts; i++) {
      ghostArray[i] = createNewGhost(
                  40 + Math.random() * (canvas.width - 40),
                  canvas.height / 2 + Math.random() * (canvas.height / 2),
                  0, 
                  0, 
                  (Math.random() < 0.1 ? false : true),
                  (Math.random() < 0.1 ? false : true));
    }

    const player = createPlayer(
                  canvas.width / 2 - 20, 
                  canvas.height - 100,
                  (Math.random() < 0.1 ? false : true),
                  (Math.random() < 0.1 ? false : true));

    document.addEventListener('keydown', function(event) {
      event.preventDefault();

      switch (event.keyCode) {
        case 37:
          player.input.left = true;
          break;
        case 38:
          player.input.up = true;
          break;
        case 39:
          player.input.right = true;
          break;
        case 40: 
          player.input.down = true;
          break;
      }
    });

    document.addEventListener('keyup', function(event) {
      event.preventDefault();

      switch (event.keyCode) {
        case 37:
          player.input.left = false;
          break;
        case 38:
          player.input.up = false;
          break;
        case 39:
          player.input.right = false;
          break;
        case 40: 
          player.input.down = false;
          break;
      }
    });

    module.update = function () {
      updatePlayerSpeed();
      moveGhost(player);
      checkCollisions(player);
      drawGhost(player);

      checkCollisionWithPlayer();
        checkCollisionWithFan();
//now this whole section needs reworking
      ghostArray.forEach(function updateAndDrawGhosts (g) {
        updateSpeed(g);
        moveGhost(g);
        checkCollisions(g);
        //checkCollisionWithFan();
        drawGhost(g);
      });
    }

    return module;
  })(40, canvas.getContext('2d'));

  canvas.addEventListener('mousedown', function() {
    fan.setOn(true);
  });
  canvas.addEventListener('mouseup', function() {
    fan.setOn(false);
  });


  (function () {
    function main() {
      window.requestAnimationFrame( main );
      
      ctx.clearRect(0, 0, 600, 600);
      Ghosts.update();
      fan.render();
    }
    
    main(); // Start the cycle
  })();

}