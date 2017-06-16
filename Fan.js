const fan = (function (x, y) {
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');

  const fan = {};

  let on = false;
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
    ctx.closePath();
    ctx.stroke();
  }

  return fan;
}(200, 0));
