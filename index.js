function draw() {
  let ctx;

  const canvas = document.getElementById('boxCanvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }





  canvas.addEventListener('mousedown', function() {
    fan.setOn(true);
  });
  canvas.addEventListener('mouseup', function() {
    fan.setOn(false);
  });


  (function () {
    function main() {
      window.requestAnimationFrame( main );
      
      ctx.clearRect(0, 0, 600, 600);
      Ghosts.update();
      fan.render();
    }
    
    main(); // Start the cycle
  })();

}