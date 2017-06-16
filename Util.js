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

Util.detectEncompass = function (a, b) {
//true if a is fully within b
}