const Sprites = (function() {
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');

/* 
Disabling image smoothing gives crisper edges but jittery motion- 
probably because it's per-pixel movement? 
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
*/
  const source = new Image();
  source.src = 'spriteSheet.png';

  const WIDTH = 56;
  const HEIGHT = 67;

  /*
    Could also combine seperate sprites for body, eyes and mouth
    to save a little room but this is simpler
  */
  sprites = {
    npcBothEyeSad: {x: 0, y: 0},
    npcRightEyeSad: {x: 56, y: 0},
    npcLeftEyeSad: {x: 112, y: 0},
    npcNoEyeSad: {x: 168, y: 0},
    npcBothEyeHappy: {x: 224, y: 0},
    npcRightEyeHappy: {x: 280, y: 0},
    npcLeftEyeHappy: {x: 336, y: 0},
    npcNoEyeHappy: {x: 392, y: 0},

    playerBothEyeSad: {x: 0, y: 68},
    playerRightEyeSad: {x: 56, y: 68},
    playerLeftEyeSad: {x: 112, y: 68},
    playerNoEyeSad: {x: 168, y: 68},
    playerBothEyeHappy: {x: 224, y: 68},
    playerRightEyeHappy: {x: 280, y: 68},
    playerLeftEyeHappy: {x: 336, y: 68},
    playerNoEyeHappy: {x: 392, y: 68}
  };

  const module = {};
  
  module.render = function (name, dX, dY) {
    //TODO: force capitolization on generated sprite name- easy to make a mistake here
    const sprite = sprites[name];
    ctx.drawImage(source, sprite.x, sprite.y, WIDTH, HEIGHT, dX, dY, WIDTH, HEIGHT);
  }

  return module
})();

