//  creating var for gamestate
var PLAY = 1;
var END = 0;
var gameState = PLAY;

// (need to collide with sth)
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOver, restart;

// loading the images and incase of trex we are loading animation
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

// setting up sprites, scaling and makes ground visible 
function setup() {
  giving the canvus withi the game should be playing
  createCanvas(600, 200);
  
  // adding animation for running and collide
  trex = createSprite(50, 188, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  // (scaling trex)
  trex.scale = 0.5;

  ground = createSprite(200, 200, 400, 20);
  ground.addImage("ground", groundImage);
  // width of the ground should be half to not to disappear
  // as the ground increases velocity also increase
  ground.x = ground.width / 2;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  // scaling them not to cover the whole content
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, 200, 400, 10);
  invisibleGround.visible = false;

  // say its just new group for both of them
  cloudGroup = new Group();
  obstaclesGroup = new Group();
// starts from zero
  score = 0;
}

function draw() {
  background("white");

  // shocasing the score

  // the score here is increasing base on the framerate (directly propotional to the length of the game)
  // we are dividing by 60 
  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);

    // mentioning the specific height for the trex to jump the certian height than that an asked the trex to jump
    if (keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
// addding gravity to trex . some positive number that comes down
    trex.velocityY = trex.velocityY + 0.8;

    // mentioning the velocity to the ground. condition if it is greater than zero it will continue coming
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    // two function
    spawnClouds();
    spawnObstacles();

    // whenever the trex touches the obstacles gamestate end
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
    // what happens in gamestate end
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    trex.changeAnimation("collided", trex_collided);
//  velocity not to stop the game
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setLifetimeEach(-1); 
    cloudGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      // another funtion
      reset();
    }
  }

  trex.collide(invisibleGround);

  drawSprites();

  fill(0);
  text("Score: " + score, 500, 50);
}

// function spawnClouds() {
//   if my framecount is divisible by 60 and has no freminder then only then the sprite be created
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(80, 120));
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    // adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    // round for 200 frames
    cloud.lifetime = 200;

// adding each cloud to the group
    cloudGroup.add(cloud);
  }
}

// calculation
function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
// scale and lifetime to the obstacles
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;

    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  // disappear
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
  ground.velocityX = -(6 + score / 100);
}  