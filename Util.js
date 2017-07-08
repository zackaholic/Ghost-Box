const canvas = document.getElementById('boxCanvas');
const ctx = canvas.getContext('2d');
const Util = {};

Util.detectContact = function (a, b) {
//assumes a and b are objects with parameters x, y (top left coords), width, height
  if ( a.x + a.width > b.x 
        && a.x < b.x + b.width 
        && a.y + a.height  > b.y
        && a.y < b.y + b.height ) {
    return true;
  }
  return false;
}

Util.detectWallCollision = function(a) {
  const collisions = {
    left : false,
    right : false,
    top : false,
    bottom : false
  };

  if (Util.detectContact(a, Box.walls.left)) {
    collisions.left = true;
  }
  if (Util.detectContact(a, Box.walls.right)) {
    collisions.right = true;
  }
  if (Util.detectContact(a, Box.walls.bottom)) {
    collisions.bottom = true;
  }
  if (Util.detectContact(a, Box.walls.top.left) || Util.detectContact(a, Box.walls.top.right)) {
    collisions.top = true;
  }  

  return collisions;
};

Util.detectEncompass = function (a, b) {
//true if a is fully within b
//doesn't check if a is larger than b

  if (a.x > b.x
      && a.x + a.width < b.x + b.width
      && a.y > b.y
      && a.y + a.height < b.y + b.height) {
    return true;
  }
  return false;
}

// function get(url, data) {
//   return new Promise(function (resolve, reject) {
//     let req = new XMLHttpRequest();
//     req.open('GET', url);

//     req.onload = function() {
//       if (req.status === 200) {
//         resolve(req.response);
//       }
//       else {
//         reject(Error(req.statusText));
//       }
//     };

//     req.onerror = function() {
//       reject(Error('Error connecting to server'));
//     };

//     req.send();
//   });
// }

Util.post = function (url, data) {
  return new Promise(function(resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('POST', url);

    req.onload = function() {
      if (req.status === 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onError = function() {
      reject(Error('Error connecting to server'));
    };

    req.send(data);
  });
}

