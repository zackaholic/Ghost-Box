const Fan = (function () {
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');

  const module = {};

  const fan = (function() {
    const fan = {};
    let on = false;
    const width = 180;
    const height = 100;
    const x = canvas.width / 2 - width / 2;
    const y = 0;

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
      ctx.closePath();
      ctx.stroke();
    }

    return fan;
  })();

  module.getBounds = function() {
    return fan.getBounds();
  }

  module.updateAndRender = function() {
    fan.render();
  }

  return module;
})();
