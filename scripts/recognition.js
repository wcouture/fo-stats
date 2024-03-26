let Images = [];

// Keeping track of faceoffs done
var faceoffCount = 3;
var currentFaceoff = 0;
var choicePressed = false;

// Possible outcomes of first punch
let Outcomes = { "ClampFrontShoveled": 0, "ClampReverseShoveled": 1, "ClampBellyToHelmet": 2, "LostPlunger": 3, "LostFlatClamp": 4 };
// Phases of the program
let State = { "Menu": 0, "Prewhistle": 1, "Postwhistle": 2, "Stats": 3 };
// Phases of the faceoff before first punch
let FOPhase = { "Down": 0, "Set": 1, "Whistle": 2 };

// Faceoff decision making stats
var startTime, endTime, decisionTime, statsText;
var reactionTimes = [], outcomes = [], choicesMade = [], scores = [];
let choicesText = ["Forward Exit", "Right Shoulder Exit", "TTL Exit", "Front Shovel Counter", "Reverse Shovel Counter"];
let outcomesText = ["Won the clamp, being front shoveled", "Won the clamp, getting reverse shoveled", "Won clamp, getting belly to helmeted", "Lost the clamp, opponent in plunger", "Lost the clamp, opponent in flat clamp"];
let menu_text = " - Press Enter to Continue -\n\n\nKeys:\n1) Forward Exit | 2) Right Shoulder | 3) TTL\n4) Front Shovel | 3) Reverse Shovel"; 
// Tracks phases of the faceoff calls and program phases
var currPhase;
var currState;

// Handling delays
var lastTime, currTime, outcomePicked = false, outcomeIndex = -1;

// Screen dimensions
let HEIGHT = 900, WIDTH = 1350;

// Start faceoff image
var startImg;
var imageSize;
var imagePosition;

var backgroundPosition, backgroundSize;

function preload() {
  startImg = loadImage("/img/start.jpg");

  Images.push(loadImage('/img/rightShoulder.jpg'));
  Images.push(loadImage('/img/frontExit.jpg'));
  Images.push(loadImage('/img/TTL.jpg'));
  Images.push(loadImage('/img/frontShovel.jpg'));
  Images.push(loadImage('/img/reverseShovel.jpg'));
}

function setup() {
  // Populate images object with initialized image objects or image pathways
  createCanvas(WIDTH, HEIGHT);
  currState = State["Menu"];
  currPhase = FOPhase["Down"];

  imageSize = [3 * 200, 4 * 200];
  imagePosition = [(WIDTH / 2) - (imageSize[0] / 2), (HEIGHT / 2) - (imageSize[1] / 2)];

  backgroundSize = [1000, 200];
  backgroundPosition = [(WIDTH/2) - 500, (HEIGHT/2) - 200];


  fill(255, 255, 255);
  textStyle(BOLD);
  stroke(color(120, 47, 64));
  strokeWeight(4);
  //frameRate(1);
}

function draw() {
  background(206,184,136);
  switch (currState) {
    case State["Menu"]:
      displayMenu();
      break;
    case State["Prewhistle"]:
      prewhistle();
      break;
    case State["Postwhistle"]:
      postwhistle();
      break;
    case State["Stats"]:
      displayStats();
      break;
  }
}

function displayMenu() {
  textSize(28);
  textAlign(CENTER);
  text(menu_text, WIDTH / 2, HEIGHT / 2);

  if (keyIsPressed && keyCode == 13) {
    currState = State["Prewhistle"];
    lastTime = Date.now();
  }

}

function prewhistle() {
  push();
  strokeWeight(6);
  rect(imagePosition[0] - 5, imagePosition[1] - 5, imageSize[0] + 10, imageSize[1] + 10);

  image(startImg, imagePosition[0], imagePosition[1], imageSize[0], imageSize[1]);
  pop();  
  switch (currPhase) {
    case FOPhase["Down"]:
      currTime = Date.now();
      text("Down", WIDTH / 2, HEIGHT / 2);
      if (currTime - lastTime >= 1000) {
        lastTime = currTime;
        currPhase = FOPhase["Set"];
      }
      break;
    case FOPhase["Set"]:
      currTime = Date.now();
      text("Set", WIDTH / 2, HEIGHT / 2);
      if (currTime - lastTime >= 1000) {
        lastTime = currTime;
        currPhase = FOPhase["Whistle"];
      }
      break;
    case FOPhase["Whistle"]:
      // Play whistle sound
      currState = State["Postwhistle"];
      currPhase = FOPhase["Down"];
      startTime = Date.now();
      choicePressed = false;
      break;
  }
}

function postwhistle() {
  // Pick faceoff outcome
  if(!outcomePicked){
    outcomeIndex = floor(Math.random() * 5);
    outcomePicked = true;
  }

  push();
  strokeWeight(6);
  rect(imagePosition[0] - 5, imagePosition[1] - 5, imageSize[0] + 10, imageSize[1] + 10);
  image(Images[outcomeIndex], imagePosition[0], imagePosition[1], imageSize[0], imageSize[1]);
  
  
  textSize(36);
  push();
  fill(0,0,0,150);
  rect(backgroundPosition[0], backgroundPosition[1], backgroundSize[0], backgroundSize[1]);
  pop();
  pop();
  // Display image of Faceoff outcome
  text("- Select Move -", WIDTH / 2, HEIGHT / 2 - 200);
  let options = "1 = Forward Exit | 2 = Right Shoulder | 3 = TTL Exit\n4 = Front Shovle | 5 = Reverse Shovel";

  push();
  textSize(28);
  // Print out options
  text(options, WIDTH / 2, HEIGHT / 2 - 100);
  pop();

  if (keyIsPressed && !choicePressed && keyCode >= 49 && keyCode < 54) {
    choicePressed = true;
    let choice = keyCode - 49;

    // Grade the choice based on the outcome
    let score = gradeChoice(choice, outcomeIndex);
    console.log("Score: " + score);
    scores.push(score);

    currentFaceoff++;

    endTime = Date.now();
    decisionTime = endTime - startTime;
    reactionTimes.push(decisionTime);

    outcomes.push(outcomeIndex);
    choicesMade.push(choice);
    //scores.push();
    outcomePicked = false;
    
    if (currentFaceoff >= faceoffCount) {
      currState = State["Stats"];
    }
    else {
      currState = State["Prewhistle"];
      lastTime = Date.now();
    }
  }

}

function gradeChoice(choice, outcome) {
  console.log("Outcome: " + outcome + " | Choice: " + choice);
  if (outcome < 3) {
    // Won clamp
    if (choice > 2) {
      // Countered on a won clamp
      return 0;
    }
    switch (outcome) {
      case 0: // Getting front shoveled
        if (choice == 1) return 3; // Exit right shoulder
        if (choice == 2) return 2; // Exit TTL
        if (choice == 0) return 1; // Exit forward
        break;
      case 1: // Getting reverse shoveled
        if (choice == 0) return 3; // Exit forward
        if (choice == 2) return 2; // Exit TTL
        if (choice == 1) return 1; // Exit right shoulder
        break;
      case 2: // Getting belly-to-helmeted
        if (choice == 2) return 3; // Exit TTL
        return 1; // Exit forward or right shoulder
        break;
    }
  }

  // Lost clamp
  if (choice < 3) {
    return 0;
  }
  if (outcome == 3) { // Opponent plungering
    if (choice == 3) return 3; // Front shovel
    return 1; // Reverse shovel
  }
  // Opponent flat clamp
  if (choice == 3) return 1; // Front shovel
  return 3; // Reverse shovel
}

function displayStats() {
  textSize(36);
  text("- Reaction Time Statistics -", WIDTH / 2, 100);
  var totalTime = 0;

  if (currentFaceoff >= faceoffCount) {
    statsText = "";
    for (i = 0; i < faceoffCount; i++) {
      statsText += "Faceoff " + i + ":\n";
      statsText += "Reaction Time = " + reactionTimes[i] + " ms | Choice Score = " + scores[i] + "\n";
      statsText += "Punch Outcome: " + outcomesText[outcomes[i]] + " | Move Decision: " + choicesText[choicesMade[i]];
      statsText += "\n\n";

      totalTime += reactionTimes[i];
    }
    statsText += "Average Decision Time = " + (totalTime / 3) + " ms\n\n-- Press Enter to restart --";
    currentFaceoff = 0;
  }


  push();
  textSize(24);
  text(statsText, WIDTH / 2, HEIGHT / 2 - 300);
  pop();

  // Press enter to return to menu
  if (keyIsPressed && keyCode == 13) {
    currState = State["Menu"];

    // Empty all stats related arrays
    while (scores.length > 0) {
      scores.pop();
    }
    while (choicesMade.length > 0) {
      choicesMade.pop();
    }
    while (outcomes.length > 0) {
      outcomes.pop();
    }
    while (reactionTimes.length > 0) {
      reactionTimes.pop();
    }

  }

}
