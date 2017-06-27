function draw() {
  'use strict';//???
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');



  (function () {
    function main() {
      window.requestAnimationFrame( main );
      ctx.clearRect(0, 0, 600, 600);
      Box.drawWalls();
      Player.updateAndRender()
      //Player.showDebug();


      NPC.updateAndRender();
      //NPC.showDebug();

      Fan.updateAndRender();
    }
    
    main(); // Start the cycle
  })();
}