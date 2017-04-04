function draw() {
  let ctx;
  const canvas = document.getElementById('boxCanvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }

  const createGhosts = function (numGhosts) {
    const ghosts = [];

    for(let i = 0; i < numGhosts; i++) {
      ghosts[i] = Ghost(20 + Math.random() * canvas.width - 20,
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
        g.setColor("rgba(255, 200, 200, .9)");
        g.setMood('sad');
      } else {
        g.setColor("rgba(255, 255, 255, 0.9)");
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

    const ctx = CTX;
    const x = X;
    const y = Y;
    const width = 300;
    const height = 300;

    fan.getBounds = function () {
      return {
        x : x,
        y : y,
        width : width,
        height : height
      }
    }
    return fan;
  }

  const Ghost = function (X, Y, xSpeed, ySpeed, CTX) {
    const ghost = {};
    
    const numEyes = Math.random() < 0.5 ? 2 : 1;
    const ctx = CTX;
    let ghostColor = "rgba(255, 255, 255, 0.9)";
    let mood = 'sad';
    const position = {
      x : X,
      y : Y
    };
    const speed = {
      //pixels to move per frame; negative values change direction
      x : xSpeed,
      y : ySpeed
    };
    const size = {
      width: 20,
      height: 30
    };

    ghost.setColor = function (newColor) {
      ghostColor = newColor;
    };

    ghost.getPosition = function () {
      return position;
    };

    ghost.setMood = function (newMood) {
      mood = newMood;
    }

    ghost.move = function () {
      //set new position, referenced to current position in pixels
      
      position.x += speed.x;
      position.y += speed.y;
    };

    ghost.updateSpeed = function () {
      speed.x += (canvas.width / 2 - position.x) * .00001;
      speed.y += (canvas.height / 2 - position.y) * .00001;
    };

    ghost.setPosition = function (x, y) {
      position.x = x;
      position.y = y;
    };

    ghost.render = function () {
      const x = position.x;
      const y = position.y;
      const w = size.width;
      const h = size.height;
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
      

      //draw mouth
      if (mood === 'happy') {
        ctx.beginPath();
        ctx.arc(x + 25, y - 20, 50, 7 * Math.PI / 12, 5 * Math.PI / 12, true);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x + 25, y + 80, 50, 17 * Math.PI / 12, 19 * Math.PI / 12, false);
        ctx.stroke();        
      }
    }


    return ghost;
  }
  const fan = Fan(canvas.width / 2, 0, ctx);
  let ghostArray = createGhosts(20);

  (function () {
    function main() {
      window.requestAnimationFrame( main );
      
      ctx.clearRect(0, 0, 600, 600);
      ghostArray = updateGhosts(ghostArray, fan);
      drawGhosts(ghostArray);
    }
    
    main(); // Start the cycle
  })();

}