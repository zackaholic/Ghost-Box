/*
Holds NPC logic AND array of NPCs in use
*/

const NPC = (function () {    
  const canvas = document.getElementById('boxCanvas');
  const ctx = canvas.getContext('2d');
  const module = {};

  const ghosts = (function(number) {
    npcs = [];
    for (let i = 0; i < number; i++) {
      //create basic ghost with base parameters
      const npc = new Ghost.create(
                40 + Math.random() * canvas.width - 80,
                canvas.height / 2 + Math.random() * (canvas.height / 2),
                false);
      
      //now add npc-specific parameters
      npc.destination = {
        x : npc.width + Math.random() * (canvas.width - npc.width * 2),
        y : canvas.height * 0.33 + Math.random() * (canvas.height * 0.66) - npc.height
      };

      npc.inFan = false;

      npcs.push(npc);
    }
    return npcs;
  })(10);

  const setDestination = function(npc) {
    const gb = npc.getBoundingBox();
    npc.destination.x = gb.width + Math.random() * (canvas.width - gb.width * 2);
    npc.destination.y = canvas.height * 0.33 + Math.random() * (canvas.height * 0.66) - npc.height;    
  }

  const move = function (npcs) {
    npcs.forEach(function(g, index, gArray) {
      //set new position, referenced to current position in pixels
      g.position.x += g.speed.x;
      //TODO: all ghosts end up oscillation to the right and below their destination after awhile...
      g.position.y += g.speed.y + (Ghost.sinLookup[g.moveIndex++ % Ghost.sinLookup.length]);

      if (Util.detectContact(g.getBoundingBox(), {x: g.destination.x, y: g.destination.y, width: 40, height: 40})) {
        setDestination(g);
      }
      if (++g.moveIndex === Ghost.sinLookup.length) {
        g.moveIndex = 0;
      }
      //if ghost was blown out the fan, delete it, send open command
      if (g.position.y < -g.height) {
        gArray.splice(index, 1);
        Fan.open();
      }
    });
  };

  const render = function (npcs) {
    npcs.forEach(function(g) {
      g.render();
    });
  }

  const updateSpeed = function (npcs, player) {
    npcs.forEach(function(g) {
      const destinationSpeed = {
        x : 0,
        y : 0        
      };
      
      const avoidPlayerSpeed = {
        x : 0,
        y : 0
      };

      destinationSpeed.x = 0.00001 * (g.destination.x - g.position.x);
      destinationSpeed.y = 0.00001 * (g.destination.y - g.position.y) 

      if (Util.detectContact(g.getBoundingBox(), player.getInfluenceBox())) {

        avoidPlayerSpeed.x = 0.0001 * (player.position.x - g.position.x);
        avoidPlayerSpeed.y = 0.0001 * (player.position.y - g.position.y);
      }

      avoidPlayerSpeed.x = Math.abs(avoidPlayerSpeed.x) > 0.2
                      ? Math.sign(avoidPlayerSpeed.x) * 0.2
                      : avoidPlayerSpeed.x;

      avoidPlayerSpeed.y = Math.abs(avoidPlayerSpeed.y) > 0.2
                      ? Math.sign(avoidPlayerSpeed.y) * 0.2
                      : avoidPlayerSpeed.y;

      destinationSpeed.x = Math.abs(destinationSpeed.x) > 0.2
                      ? Math.sign(destinationSpeed.x) * 0.2
                      : destinationSpeed.x;

      destinationSpeed.y = Math.abs(destinationSpeed.y) > 0.2
                      ? Math.sign(destinationSpeed.y) * 0.2
                      : destinationSpeed.y;

      g.speed.x += destinationSpeed.x - avoidPlayerSpeed.x;
      g.speed.y += destinationSpeed.y - avoidPlayerSpeed.y;

      //clamp to max speed if not being blown out of fan
      if (!g.inFan) {
        g.speed.x = Math.abs(g.speed.x) > 0.3
                        ? Math.sign(g.speed.x) * 0.3
                        : g.speed.x;

        g.speed.y = Math.abs(g.speed.y) > 0.3
                        ? Math.sign(g.speed.y) * 0.3
                        : g.speed.y;
      }
    });
  };

  const checkFanProximity = function (npcs) {
    let fanProximity = false;
    const fanThreshold = 150;
    const fb = Fan.getBounds();
    fb.height = fanThreshold;
    npcs.forEach(function(g) {
      //necessary to check every ghost here? Break if proximity detected?
      //could use npcs.every() or npcs.some()
      if (Util.detectContact(g.getBoundingBox(), fb)) {
        fanProximity = true;
      }
    });
    if (fanProximity) {
      Fan.on();
    } else {
      Fan.off();
    }
  }

  const checkFanCollision = function (npcs) {
    let fanCollision = false;
    npcs.forEach(function (g) {
      if (Util.detectContact(g.getBoundingBox(), Fan.getBounds())) {
        fanCollision = true;
        g.mood = 'Sad';
        g.inFan = true;
        g.speed.y -= 1;
      } else {
        g.inFan = false;
      }
    });
    if (fanCollision) { 

     }
  }

  const checkWallCollisions = function(npcs) {
    npcs.forEach(function(g) {
      const gb = g.getBoundingBox();
      const collisions = Util.detectWallCollision(gb);

      if (collisions.left) {
        g.position.x = Box.walls.left.x + Box.walls.left.width;
        g.speed.x = 0;
      }
      if (collisions.right) {
        g.position.x = Box.walls.right.x - gb.width;
        g.speed.x = 0;
      }
      if (collisions.bottom) {
        g.position.y = Box.walls.bottom.y - gb.height;
        g.speed.y = 0;
      }
      if (collisions.top) {
        g.position.y = Box.walls.top.left.y + Box.walls.top.left.height;
        g.speed.y = 0;
      }  
    });
  };

  const checkPlayerCollision = function (npcs, player) {
    let playerCollision = false;
    npcs.forEach(function(g) {
      if (Util.detectContact(player.getInfluenceBox(), g.getBoundingBox())) {
        g.mood = 'Sad';
        playerCollision = true;
      } else {
        g.mood = 'Happy';
      }
    });
    if (playerCollision) {
      player.mood = 'Happy';
    } else {
      player.mood = 'Sad';
    }
  }

  module.showDebug = function () {
    ghosts.forEach(function(ghost) {
      ctx.strokeStyle = 'rgb(255, 100, 100)';

      ctx.beginPath();
      ctx.moveTo(ghost.getCenter().x, ghost.getCenter().y);
      ctx.lineTo(ghost.destination.x, ghost.destination.y);
      ctx.stroke();
      ctx.strokeText('x: ' + ghost.speed.x.toPrecision(2) + ' y: ' + ghost.speed.y.toPrecision(2), ghost.position.x, ghost.position.y);
      ctx.beginPath();
      // ctx.rect(ghost.getBoundingBox().x, ghost.getBoundingBox().y,
      //          ghost.width, ghost.height);
      // ctx.stroke();
      ctx.strokeStyle = '#1a1a1a';    
    });
  }

  module.updateAndRender = function () {
    updateSpeed(ghosts, Player.player);
    move(ghosts);
    checkWallCollisions(ghosts);
    checkPlayerCollision(ghosts, Player.player);
    checkFanProximity(ghosts);
    checkFanCollision(ghosts);
    render(ghosts);
  }

  return module;
}());
