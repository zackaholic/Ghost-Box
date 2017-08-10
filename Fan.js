const Fan = (function () {
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');
  const fan = {};

  let fanOn = false;
  let ghostProximity = 0;
  const width = 180;
  const height = 100;
  const x = canvas.width / 2 - width / 2;
  const y = 0;

  fan.setSpeed = (function () {
    let lastCall = Date.now();
    let serverReady = true;    
    const rate = 200; //min time between server posts in ms

    const ss = function(speed) {
      if (serverReady === true && Date.now() - lastCall > rate) {
        serverReady = false;
        lastCall = Date.now();
        Util.get('http://192.168.42.80/fanSpeed').then(function(res) {
          console.log(res);
          serverReady = true;
        }, function (err) {
          console.log(err);
        });
      }
    }
    return ss;
  })();

  fan.open = function () {
    //check if server is ready? 
    Util.get('http://192.168.42.80/fanOpen').then(function(res) {
      console.log(res);
    }, function (err) {
      console.log(err);
    });    
  }

  fan.on = function () {
    //check if server is ready? 
    if (!fanOn) {
      fanOn = true;
      Util.get('http://192.168.42.80/fanOn').then(function(res) {
        console.log(res);
      }, function (err) {
        console.log(err);
      });    
    }
  }

  fan.off = function () {
    //check if server is ready? 
    if (fanOn) {
      fanOn = false;
      Util.get('http://192.168.42.80/fanOff').then(function(res) {
        console.log(res);
      }, function (err) {
        console.log(err);
      });    
    }
  }

  fan.setProximity = function (p) {
    ghostProximity = Math.floor(p);
    if (p > 0) {
      fan.setSpeed(ghostProximity);
    }
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
    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(x + width, y);
    // ctx.lineTo(x + width, y + height);
    // ctx.lineTo(x, y + height);
    // ctx.closePath();
    // ctx.stroke();
  }

  return fan;
})();




