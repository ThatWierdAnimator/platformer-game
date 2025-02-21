const c = document.getElementById("canvas");
const dimensions = getObjectFitSize(
    true,
    c.clientWidth,
    c.clientHeight,
    c.width,
    c.height
);

let debug = {
    velocities: true,
    timeDelay: 100
}

// player object
let player = {
    x: 0,
    y: dimensions.height,
    size: 50,
    velX: 5,
    velY: 0,
    velYCap: 15,
    grav: 0,
    grounded: true,
    jumping: false,
    jumpheight: -8,
    jump: (vel) => {player.velY = vel; player.grounded = false; player.grav = 0.1},
    moveSpeed: 5,
    move: (vel) => player.velX = vel
}
player.y -= player.size;

let aPressed = false;
let dPressed = false;

// draw everything
function render() {
    c.width = dimensions.width;
    c.height = dimensions.height;

    let ctx = c.getContext("2d");
    ctx.scale(1, 1);

    // draw player
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // draw velocites for debugging
    if (debug.velocities) {
        // diagonal
        if (player.velX !== 0 && player.velY !== 0)
        {   
            ctx.strokeStyle = 'green';
            ctx.beginPath();
            ctx.moveTo(player.x + player.size/2, player.y + player.size/2);
            ctx.lineTo(player.x + player.velX * 17 + player.size/2, player.y + player.velY * 17 + player.size/2);
            ctx.stroke();
        }

        // horizontal
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(player.x + player.size/2, player.y + player.size/2);
        ctx.lineTo(player.x + player.velX * 20 + player.size/2, player.y + player.size/2);
        ctx.stroke();

        // vertical
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(player.x + player.size/2, player.y + player.size/2);
        ctx.lineTo(player.x + player.size/2, player.y + player.velY * 20 + player.size/2);
        ctx.stroke();
    }
}
  
// adapted from: https://www.npmjs.com/package/intrinsic-scale
function getObjectFitSize(
  contains /* true = contain, false = cover */,
  containerWidth,
  containerHeight,
  width,
  height
) {
  var doRatio = width / height;
  var cRatio = containerWidth / containerHeight;
  var targetWidth = 0;
  var targetHeight = 0;
  var test = contains ? doRatio > cRatio : doRatio < cRatio;

  if (test) {
    targetWidth = containerWidth;
    targetHeight = targetWidth / doRatio;
  } else {
    targetHeight = containerHeight;
    targetWidth = targetHeight * doRatio;
  }

  return {
    width: targetWidth,
    height: targetHeight,
    x: (containerWidth - targetWidth) / 2,
    y: (containerHeight - targetHeight) / 2
  };
}

// update player position
function updatePlayer() {
    // update velocity due to gravity
    if (!player.grounded && player.velY < player.velYCap) {
        player.velY += player.grav;
    }

    // check left and right movement
    if (aPressed && dPressed) {
        player.move(0);
    } else if (aPressed) {
        player.move(player.moveSpeed * -1)
    } else if (dPressed) {
        player.move(player.moveSpeed);
    } else {
        player.move(0);
    }

    // add velocities to player
    player.x += player.velX;
    player.y += player.velY;

    // collide with the ground
    if (player.y >= dimensions.height - player.size) {
        player.y = dimensions.height - player.size;
        player.velY = 0;
        player.grounded = true;
    }

    // if the player should fall, they fall faster, for the game feel
    if (!player.jumping || player.velY > 0) {
        player.grav = 0.5;
    }
}

addEventListener('keypress', e => {
    // jump, only if grounded
    if (e.key === 'w' && player.grounded) {
        player.jumping = true;
        player.jump(player.jumpheight);
    }

    // left and right checks
    if (e.key === 'a') {
        aPressed = true;
    } else if (e.key === 'd') {
        dPressed = true;
    }
});

addEventListener('keyup', e => {
    // stop jumping
    if (e.key === 'w') {
        // stop jump dead in it's tracks
        if (player.velY < 0) {
            player.velY = 0;
        }
        player.jumping = false;
    }

    // left and right checks
    if (e.key === 'a') {
        aPressed = false;
    } else if (e.key === 'd') {
        dPressed = false;
    }
})

// call all update functions and render it
// this also loops itself
function updateAll() {
    updatePlayer();
    render();
    setTimeout(updateAll, 1 + debug.timeDelay);
}

updateAll();