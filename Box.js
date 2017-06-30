const Box = (function() {
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');
  const module = {};

  const wallThickness = 10;

  module.walls = {
    left : {
      x : 0,
      y : 0,
      width : wallThickness,
      height : canvas.height
    },
    right : {
      x : canvas.width - wallThickness,
      y : 0,
      width : wallThickness,
      height : canvas.height
    },
    bottom : {
      x : 0,
      y : canvas.height - wallThickness,
      width : canvas.width,
      height : wallThickness
    },
    top : {
      left : {
        x : 0,
        y : 0,
        width : canvas.width / 2 - Fan.getBounds().width / 2,
        height : wallThickness * 2
      },
      right : {
        x : canvas.width / 2 + Fan.getBounds().width / 2,
        y : 0,
        width : canvas.width / 2 - Fan.getBounds().width / 2,
        height : wallThickness * 2
      }
    }
  };

  const drawBackground = function () {
    const lightness = '#4a4a4a';
    const darkness = '#111';
    const fb = Fan.getBounds();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw spotlight
    const spotGradient = ctx.createRadialGradient(canvas.width / 2, -10, 10, canvas.width / 2, -10, 500);
    spotGradient.addColorStop(0, lightness);
    spotGradient.addColorStop(1, darkness);
    ctx.fillStyle = spotGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // //draw opening
    // const openGradient = ctx.createLinearGradient(fb.x, wallThickness, fb.x + fb.width, wallThickness);
    // openGradient.addColorStop(0, '#222');
    // openGradient.addColorStop(0.5, '#aaa');
    // openGradient.addColorStop(1, '#222');
    // ctx.fillStyle = openGradient;
    // ctx.fillRect(fb.x, 0, fb.width, 20);
    // ctx.stroke();

    //draw shadows
    ctx.fillStyle = darkness
    ctx.beginPath();
    ctx.moveTo(fb.x, wallThickness * 2);
    ctx.lineTo(wallThickness, canvas.height * .66);
    ctx.lineTo(wallThickness, wallThickness * 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(fb.x + fb.width, wallThickness * 2);
    ctx.lineTo(canvas.width - wallThickness, canvas.height * .66);
    ctx.lineTo(canvas.width - wallThickness, wallThickness * 2);
    ctx.closePath();
    ctx.fill();
  }

  const drawWalls = function () {
    ctx.fillStyle = '#000';
    ctx.fillRect(module.walls.left.x, module.walls.left.y, module.walls.left.width, module.walls.left.height);
    ctx.fillRect(module.walls.right.x, module.walls.right.y, module.walls.right.width, module.walls.right.height);
    ctx.fillRect(module.walls.bottom.x, module.walls.bottom.y, module.walls.bottom.width, module.walls.bottom.height);
    ctx.fillRect(module.walls.top.left.x, module.walls.top.left.y, module.walls.top.left.width, module.walls.top.left.height);        
    ctx.fillRect(module.walls.top.right.x, module.walls.top.right.y, module.walls.top.right.width, module.walls.top.right.height);        
  }

  module.render = function () {
    drawBackground();
    drawWalls();
  }

  return module;
})();


