/*
Ghost prototype contains ghost constructor, render functions. Prototype for player and 
NPC ghosts.
*/

const Ghost = (function () {    
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');
  const module = {};

  module.create = function(X, Y, isPlayer) {
    this.sprite = chooseSprite(isPlayer);
    this.mood = 'Happy';
    //start oscillation on a random index so they don't move in unison
    //moveIndex should be called oscillateIndex or something
    this.moveIndex = Math.floor(Math.random() * module.sinLookup.length);
    this.width = 55;
    this.height = 66;
    this.oscillationRate = 3;

    this.position = {
      x : X,
      y : Y
    };

    this.getCenter = function () {
      return {
        x : this.position.x + this.width / 2,
        y : this.position.y + this.height / 2
      };      
    }

    this.getBoundingBox = function () {
      return {
        x : this.position.x,
        y : this.position.y,
        width : this.width,
        height : this.height 
      };
    };

    this.speed = {
      //pixels to move per frame; negative values change direction
      x : 0,
      y : 0
    };

    this.render = function () {
      Sprites.render(this.sprite + this.mood, this.position.x, this.position.y);
    }
  };

  function chooseSprite(isPlayer) {
    //this is a pretty goofy way to select a random sprite
    const range = Math.floor(Math.random() * 20);
    let sprite = '';
    if (isPlayer === true) {
      sprite = 'player';
    } else {
      sprite = 'npc';
    }

    if (range === 19) {
      sprite += 'NoEye';
    } else if (range < 19 && range >= 17) {
      sprite += 'LeftEye';
    } else if (range < 17 && range >= 15) {
      sprite += 'RightEye';
    } else {
      sprite += 'BothEye';
    }
    return sprite;
  }

  module.sinLookup = (function(steps) {
    const lookup = [];
    let index = 0;
    for (i = 0; i <= Math.PI * 2; i+= Math.PI * 2 / steps) {
      //scale down to %25 or they look like they're bouncing
      lookup[index++] = Math.sin(i) * 0.25;
    }
    return lookup;
  })(180);

  return module;
}());
