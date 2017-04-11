function draw() {
  let ctx;



  const canvas = document.getElementById('boxCanvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }

  const createGhosts = function (numGhosts) {
    const ghosts = [];

    for(let i = 0; i < numGhosts; i++) {
      ghostArray[i] = Ghost(20 + Math.random() * canvas.width - 20,
                   20 + Math.random() * canvas.height - 20,
                   Math.random() - 0.5, 
                   Math.random() - 0.5, 
                   ctx);
    }
    return ghosts;
  }

  const updateGhosts = function (ghosts, fan) {
    ghosts.forEach(function(g) {
      g.updateSpeed();
      g.move();
      if (checkCollision(g.getPosition(), fan.getBounds())) {
        //g.setColor("rgba(255, 200, 200, .5)");
        g.setMood('sad');
      } else {
        //g.setColor("rgba(255, 255, 255, 0.5)");
        g.setMood('happy');
      }
    });
    return ghosts;
  }

  const checkCollision = function (ghost, box) {
    const collision = ((ghost.x > box.x) &&
                      (ghost.x < box.x + box.width) &&
                      (ghost.y > box.y) &&
                      (ghost.y < box.y + box.height));
    return collision;
  }

  const drawGhosts = function (ghosts) {
    ghosts.forEach(function (g) {
      g.render();
    });
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

//TODO: decouple rate at which ghosts oscillate from the length of this array-
//make a proper pixels per frame variable or something and use these as reference values
    const moveLookup = (function(steps) {
      const lookup = [];
      let index = 0;
      for (i = 0; i <= Math.PI * 2; i+= Math.PI * 2 / steps) {
        lookup[index++] = Math.sin(i);
      }
      return lookup;
    })(80);

    const ghostArray = [];
    const ghostColor = "rgba(255, 255, 255, 0.6)";


    const moveGhost = function (ghost) {
      //set new position, referenced to current position in pixels
      ghost.position.x += ghost.speed.x;
      ghost.position.y += (moveLookup[ghost.moveIndex++ % moveLookup.length]) * .25 + ghost.speed.y;

      if ((Math.abs(ghost.destination.x - ghost.position.x) < 10) && (Math.abs(ghost.destination.y - ghost.position.y) < 2)) {
        ghost.destination.x = Math.random() * canvas.width;
        ghost.destination.y = canvas.height / 2 + Math.random() * canvas.height / 2;
      }
      if (++ghost.moveIndex === moveLookup.length) {
        ghost.moveIndex = 0;
      }
    };

    const updateSpeed = function (ghost) {
      if (false) {
        //if fan is on ghosts near the middle get sucked up
        const fanBounds = fan.getBounds();
        //speed.x += 0.0001 * (canvas.width / 2 - position.x);
        if ((position.x > fanBounds.x + 20) && (position.x < fanBounds.x + fanBounds.width - 20)){
          speed.y -= 3; 
          speed.x += 0.005 * (canvas.width / 2 - position.x);
        }
      } else {
        ghost.speed.x = 0.001 * (ghost.destination.x - ghost.position.x);
        ghost.speed.y = 0.001 * (ghost.destination.y - ghost.position.y); 
      }
    };

    const drawGhost = function (ghost) {
      const x = ghost.position.x;
      const y = ghost.position.y;
      // const w = size.width;
      // const h = size.height;
      ctx.fillStyle = ghostColor;
      
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

    module.update = function () {
      ghostArray.forEach(function updateAndDrawGhosts (g) {
        updateSpeed(g);
        moveGhost(g);
        drawGhost(g);
      });
    }


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

    for (let i = 0; i < numGhosts; i++) {
      ghostArray[i] = createNewGhost(
                  20 + Math.random() * canvas.width - 20,
                  20 + Math.random() * canvas.height - 20,
                  Math.random() - 0.5, 
                  Math.random() - 0.5, 
                  (Math.random() < 0.1 ? false : true),
                  (Math.random() < 0.1 ? false : true));
    }

    return module;
  })(20, canvas.getContext('2d'));

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