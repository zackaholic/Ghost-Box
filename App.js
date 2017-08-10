function draw() {
  'use strict';//???
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');
  //console.log('Hi James\nHi Chevelle');


  (function () {
    function main() {
      window.requestAnimationFrame( main );
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Box.render();
      Player.updateAndRender()
      //Player.showDebug();
      NPC.updateAndRender();
      //NPC.showDebug();
    }
    main(); // Start the cycle
  })();
}