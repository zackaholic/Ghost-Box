function draw() {
  let ctx;

  const canvas = document.getElementById('boxCanvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }

  const Fan = function (X, Y, CTX) {
    const fan = {};

    let on = false;
    const ctx = CTX;
    const x = X;
    const y = Y;
    const width = 200;
    const height = 100;

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
  }

  const Ghosts = (function (numGhosts, ctx) {    
    const module = {};

    const oscillationRate = 3;  //cycles per second
    const moveLookup = (function(steps) {
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
      ghost.position.y += ghost.speed.y + (moveLookup[ghost.moveIndex++ % moveLookup.length]) * .25;
      //don't update player destination
      if (ghost.destination){
        if ((Math.abs(ghost.destination.x - ghost.position.x) < 10) && (Math.abs(ghost.destination.y - ghost.position.y) < 10)) {
          ghost.destination.x = Math.random() * canvas.width;
          ghost.destination.y = canvas.height / 2 + Math.random() * canvas.height / 2;
        }
      }
      if (++ghost.moveIndex === moveLookup.length) {
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

      const fanSpeed = {
//        const fanBounds = fan.getBounds();

        // if ((position.x > fanBounds.x + 20) && (position.x < fanBounds.x + fanBounds.width - 20)){
        //   speed.y -= 3; 
        //   speed.x += 0.005 * (canvas.width / 2 - position.x);
        // }      
      }

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
        //player.speed.x = Math.min(player.speed.x, -1 * player.maxSpeed)
      }
      if (player.input.right) {
        player.speed.x += player.speedIncrement;
        //player.speed.x = Math.max(player.speed.x, player.maxSpeed)
      }
      if (player.input.up) {
        player.speed.y -= player.speedIncrement;
        //player.speed.y = Math.min(player.speed.y, -1 * player.maxSpeed)
      }
      if (player.input.down) {
        player.speed.y += player.speedIncrement;
        //player.speed.y = Math.max(player.speed.y, player.maxSpeed)
      }
    }            

    const checkCollisions = function(ghost) {
      if (ghost.position.x >= canvas.width - 50) {
        ghost.speed.x = 0;
        ghost.position.x = canvas.width - 50;
      }
      if (ghost.position.x <= 0) {
        ghost.speed.x = 0;
        ghost.position.x = 0;
      }
      if (ghost.position.y >= canvas.height - 50) {
        ghost.speed.y = 0;
        ghost.position.y = canvas.height - 50;
      }
      if (ghost.position.y <= 15) {
        ghost.speed.y = 0;
        ghost.position.y = 15;
      }

    }

    const drawGhost = function (ghost) {
      const x = ghost.position.x;
      const y = ghost.position.y;
      // const w = size.width;
      // const h = size.height;
      if (!(ctx.fillStyle = ghost.color)) {
        ctx.fillStyle = ghostColor;
      }

      //draw body
      ctx.beginPath();
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x, y + 45);
      ctx.arc(x + 5, y + 45, 5, Math.PI, 0, true);
      ctx.arc(x + 15, y + 45, 5, Math.PI, 0, false);
      ctx.arc(x + 25, y + 45, 5, Math.PI, 0, true);
      ctx.arc(x + 35, y + 45, 5, Math.PI, 0, false);
      ctx.arc(x + 45, y + 45, 5, Math.PI, 0, true);
      ctx.moveTo(x + 0, y + 10);
      ctx.arc(x + 25, y + 10, 25, Math.PI, false);
      ctx.lineTo(x + 50, y + 45);
      ctx.fill();

      //draw eyes
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      if (ghost.hasLeftEye) {ctx.ellipse(x + 15, y + 9, 3, 6, 0, 0, 2 * Math.PI);}
      if (ghost.hasRightEye) {ctx.ellipse(x + 35, y + 9, 3, 6, 0, 0, 2 * Math.PI);}      
      ctx.fill();

      //draw mouth
      if (true) {
        ctx.beginPath();
        ctx.arc(x + 25, y - 22, 50, 7 * Math.PI / 12, 5 * Math.PI / 12, true);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x + 25, y + 78, 50, 17 * Math.PI / 12, 19 * Math.PI / 12, false);
        ctx.stroke();        
      }
    };


    const createNewGhost = function(X, Y, xSpeed, ySpeed, rightEye, leftEye) {
      const ghost = {
        hasRightEye : rightEye,
        hasLeftEye : leftEye,
        mood : 'happy',
        moveIndex : Math.floor(Math.random() * moveLookup.length),
        position : {
          x : X,
          y : Y
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
        hasRightEye : rightEye,
        hasLeftEye : leftEye,
        color : 'rgba(255, 220, 220, 0.6)',
        maxSpeed : (30 / 60),
        speedIncrement : 0.01,
        mood : 'happy',
        moveIndex : Math.floor(Math.random() * moveLookup.length),
        
        input : {
          left : false,
          right : false,
          up : false,
          down : false
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

      ghostArray.forEach(function updateAndDrawGhosts (g) {
        updateSpeed(g);
        moveGhost(g);
        checkCollisions(g);
        drawGhost(g);
      });
    }

    return module;
  })(60, canvas.getContext('2d'));

  canvas.addEventListener('mousedown', function() {
    fan.setOn(true);
  });
  canvas.addEventListener('mouseup', function() {
    fan.setOn(false);
  });

  const fan = Fan(canvas.width / 2 - 100, 0, ctx);


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