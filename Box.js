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
        height : wallThickness
      },
      right : {
        x : canvas.width / 2 + Fan.getBounds().width / 2,
        y : 0,
        width : canvas.width / 2 - Fan.getBounds().width / 2,
        height : wallThickness
      }
    }
  };

  module.drawWalls = function() {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.rect(module.walls.left.x, module.walls.left.y, module.walls.left.width, module.walls.left.height);
    ctx.rect(module.walls.right.x, module.walls.right.y, module.walls.right.width, module.walls.right.height);
    ctx.rect(module.walls.bottom.x, module.walls.bottom.y, module.walls.bottom.width, module.walls.bottom.height);
    ctx.rect(module.walls.top.left.x, module.walls.top.left.y, module.walls.top.left.width, module.walls.top.left.height);        
    ctx.rect(module.walls.top.right.x, module.walls.top.right.y, module.walls.top.right.width, module.walls.top.right.height);        
    ctx.fill();
  }

  return module;
})();


