let timeCount = 0;
// Main menu components
let startButton;
let settingsButton;
let logoImage;
let backgroundImg;
// Settings menu components
let applyButton;

let countInput;

let minWaitInput;

let maxWaitInput;

let timeBetweenInput;
const INPUT_BOX_SIZE = 35;
const INPUT_BOX_SPACING = 35;
// Training page components
let quitButton;
let setActive = false;
let waitTimes = [];
let foIndex = 0;
let lastTime = 0;
let curTime = 0;
let phase = 'b';
let downPlayed = false;
let setPlayed = false;
let whistlePlayed = false;

let down_a;
let set_a;
let whistle_a;
// Training set settings
let foCount = 5;
let minWait = 1;
let maxWait = 3;
let timeBetween = 10;

var response = 'default';

function setttingsMenu(){
  clear(35);
  background(backgroundImg);
  settingsButton.remove();
  startButton.remove();
  
  applyButton = createButton("APPLY SETTINGS");
  let anchorPos = createVector(width / 2, 2 * height / 3);
  applyButton.position(anchorPos.x - (applyButton.width/2), anchorPos.y);
  applyButton.mousePressed(applySettings);

  textSize(20);
  stroke(3);
  fill(255);
  
  countInput = createInput(foCount, Number);
  countInput.size(INPUT_BOX_SIZE);
  countInput.position(anchorPos.x + countInput.width/2, anchorPos.y - 50);
  text("Draw Count:", countInput.position().x - 120, countInput.position().y - 10);

  minWaitInput = createInput(minWait, Number);
  minWaitInput.size(INPUT_BOX_SIZE);
  minWaitInput.position(anchorPos.x + (minWaitInput.width/2), anchorPos.y - 50 - INPUT_BOX_SPACING);
  text("Min Wait(s):", minWaitInput.position().x - 120, minWaitInput.position().y - 10);

  maxWaitInput = createInput(maxWait, Number);
  maxWaitInput.size(INPUT_BOX_SIZE);
  maxWaitInput.position(anchorPos.x + (maxWaitInput.width/2), anchorPos.y - 50 - 2 * INPUT_BOX_SPACING);
  text("Max Wait(s):", maxWaitInput.position().x - 120, maxWaitInput.position().y - 10);

  timeBetweenInput = createInput(timeBetween, Number);
  timeBetweenInput.size(INPUT_BOX_SIZE);
  timeBetweenInput.position(anchorPos.x + (timeBetweenInput.width/2), anchorPos.y - 50 - 3 * INPUT_BOX_SPACING);
  text("Time Between(s):", timeBetweenInput.position().x - 120, timeBetweenInput.position().y - 10);
}

function touchStarted(){
  if(getAudioContext().state !== 'running'){
    getAudioContext().resume();
  }
}

function applySettings(){
  minWait = minWaitInput.value();
  maxWait = maxWaitInput.value();
  foCount = countInput.value();
  timeBetween = timeBetweenInput.value();
  
  applyButton.remove();
  countInput.remove();
  minWaitInput.remove();
  maxWaitInput.remove();
  timeBetweenInput.remove();
  clear(35);
  background(backgroundImg);
  mainMenu();
}

function mainMenu(){
  var sideLength = height/2;
  image(logoImage, width/2 - (sideLength/2), height/2 - (sideLength/3*2), sideLength, sideLength);
  startButton = createButton("START");
  startButton.position(width / 2 - (startButton.width/2), height / 3 * 2);
  startButton.mousePressed(setStarted);

  settingsButton = createButton("SETTINGS");
  settingsButton.position(width / 2 - (settingsButton.width/2), height / 5 * 4);
  settingsButton.mousePressed(setttingsMenu);
}

function preload(){
  logoImage = loadImage('http://fo-stats.willc-dev.net/img/FOSlogo.png');
  backgroundImg = loadImage('http://fo-stats.willc-dev.net/img/backgroundImage.jpg');

  soundFormats('mp3');
  down_a = loadSound('http://fo-stats.willc-dev.net/audio/DownCall.mp3');
  set_a = loadSound('http://fo-stats.willc-dev.net/audio/SetCall.mp3');
  whistle_a = loadSound('http://fo-stats.willc-dev.net/audio/Whistle.mp3');
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER,CENTER);
  
  background(backgroundImg);
  mainMenu();
  noLoop();
}

function quitTraining(){
  foIndex = foCount;
  phase = 'b';
  quitButton.remove();
}


function setStarted(){
  settingsButton.remove();
  startButton.remove();

  quitButton = createButton("STOP");
  quitButton.position(width/2 - quitButton.width/2, height * 2 / 3);
  quitButton.mousePressed(quitTraining);
  

  for(i = 0; i < foCount; i++){
    let rand = random(maxWait - minWait);
    waitTimes.push(rand);
    
  }
  setActive = true;
  loop();
}

function draw(){
  if(response != 'default'){
    print(response);
  }
  if(setActive){
    clear(35);
    background(backgroundImg);
    
    fill(242, 242, 242);
    stroke(0);
    strokeWeight(6);
    textAlign(CENTER, CENTER);
    
    if(foIndex >= foCount){
      setActive = false;
      noLoop();
      foIndex = 0;
      clear(35);
      background(backgroundImg);
      mainMenu();
      return;
    }
    textSize(20);
    text("FO Count: " + (foIndex + 1) + "/" + foCount, width/2, 20);
    textSize(70);
    
    switch(phase){
      case 'w':
        curTime = millis();
        text(timeBetween - floor((curTime - lastTime)/1000), width/2, height/2);
        if(curTime - lastTime >= timeBetween * 1000){
          lastTime = curTime;
          phase = 'd';
        }
        break;
      case 'd':
        curTime = millis();
        if(!downPlayed){
          //play down
          down_a.play();
          downPlayed = true;
        }
        text("DOWN", width/2, height/2);
        if(curTime - lastTime >= 3000){
          lastTime = curTime + minWait * 1000;
          phase = 's';
          downPlayed = false;
        }
        break;
      case 's':
        curTime = millis();
        if(!setPlayed){
          //play set
          set_a.play();
          setPlayed = true;
        }
        text("SET", width/2, height/2);
        if(curTime - lastTime >= (waitTimes[foIndex]) * 1000){
          lastTime = curTime;
          phase = 'g';
          setPlayed = false;
        }
        break;
      case 'g':
        if(!whistlePlayed){
          //play whislte
          whistle_a.play();
          whistlePlayed = true;
        }
        text("GO", width/2, height/2);
        curTime = millis();
        if(curTime - lastTime >= 3000){
          phase = 'b'
          whistlePlayed = false;
          foIndex++; 
        }
        break;
      case 'b':
        lastTime = millis();
        curTime = millis();
        phase = 'w';
        break;
    }
  }    
}