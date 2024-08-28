class User {
  constructor(name) {
    this.name = name;
  }

  storeUserInfo() {
    const user = {
      name: this.name,
      score: 0,
    };
    localStorage.setItem("User", JSON.stringify(user));
  }
}

const base_url =
  "https://superheroapi.com/api/9db56449e42575076903e1d40945b551/";

const ruleBtn = document.querySelector(".rules-btn");
const ruleCloseBtn = document.querySelector("#ruleCloseBtn");
const ruleModal = document.querySelector("#rules-modal");
const startBtn = document.querySelector(".start-btn");
const showBtn = document.querySelector(".show-btn");
const logout = document.querySelector(".logout");
const drawCard = document.querySelector(".drawCard");
const playAgain = document.querySelector(".playAgain");
let isUser = 1;
let user;

let userScore = 0;
let robotScore = 0;

let userCardStats;
let robotCardStats;

let userPowerFullStat;

let robotChoice;
let robotPowerFullStat;

// Screens
const infoSection = document.querySelector(".info-section");
const startGame = document.querySelector(".startGame-section");
const playArea = document.querySelector(".play-section");
const result = document.querySelector(".resultBackground");

// Scores
const userScoreText = document.querySelector(".user-score");
const robotScoreText = document.querySelector(".robot-score");

// Cards
const userCard = document.querySelector("#userCard");
const robotCard = document.querySelector("#robotCard");

//Button Event Listeners
startBtn.addEventListener("click", () => {
  playArea.style.display = "flex";
  startGame.style.display = "none";
  const body = document.querySelector("body");
  body.style.backgroundImage = "url('./Images/BattleBackground.jpeg')";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "100% 100%";

  playGame();
});

logout.addEventListener("click", () => {
  localStorage.clear();
  checkForUser();
});

ruleBtn.addEventListener("click", () => {
  ruleModal.style.display = "flex";
});

ruleCloseBtn.addEventListener("click", () => {
  ruleModal.style.display = "none";
});

showBtn.addEventListener("click", () => {
  if (isUser % 2 !== 0) {
    const selectedValue = document.querySelector("select").value;

    if (selectedValue === "select trait") {
      alert("Please select trait ");
      return;
    }

    userPowerFullStat = Number(userCardStats.powerstats[selectedValue]);
    robotPowerFullStat = Number(robotCardStats.powerstats[selectedValue]);

    console.log(userPowerFullStat, robotPowerFullStat);

    if (!isNaN(userPowerFullStat) && !isNaN(robotPowerFullStat)) {
      if (userPowerFullStat > robotPowerFullStat) {
        alert("User Won");
        userScore++;
      } else if (userPowerFullStat === robotCardStats) {
        alert("It's Tie");
      } else {
        alert("Robot Won");
        robotScore++;
      }
    } else if (isNaN(userPowerFullStat) && isNaN(robotPowerFullStat)) {
      alert("No One Won , Selected stats are not comparible");
    } else {
      if (!isNaN(robotPowerFullStat)) {
        robotScore++;
      } else {
        userScore++;
      }
    }

    console.log(`User : ${userScore}, Robot : ${robotScore}`);

    displayRobotCard();

    setTimeout(() => {
      displayResult();
    }, 2000);
  }

  userScoreText.innerHTML = userScore;
  robotScoreText.innerHTML = robotScore;
  isUser++;
});

drawCard.addEventListener("click", () => {
  playGame();
  hideResult();
});

playAgain.addEventListener("click", () => {
  localStorage.clear();
  checkForUser();
  hidePlayAgain();
});

// Functions
function checkForUser() {
  const user = localStorage.getItem("User");
  if (!user) {
    ruleBtn.style.opacity = 0;
    infoSection.style.display = "flex";
    startGame.style.display = "none";
    playArea.style.display = "none";
    logout.style.display = "none";
  } else {
    ruleBtn.style.opacity = 1;
    infoSection.style.display = "none";
    startGame.style.display = "block";
    logout.style.display = "block";
  }
}
checkForUser();

// Form Submission
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.querySelector(".nameInput");
  const message = form.querySelector(".message");

  if (!name.value) {
    message.style.display = "flex";
    message.innerHTML = "Please Add Name";
    setTimeout(() => {
      message.style.display = "none";
    }, 1000);

    return;
  }

  user = new User(name.value);
  name.value = "";

  user.storeUserInfo();

  checkForUser();
});

// Get Random User Card
const getUserCard = async () => {
  loader();

  const id = Math.floor(Math.random() * 731);

  getCard(id).then((superHero) => {
    userCardStats = superHero;

    setTimeout(() => {
      setUserCard(superHero);
    }, 500);
  });
};

const getRobotCard = async () => {
  const id = Math.floor(Math.random() * 731);

  getCard(id).then((superHero) => {
    console.log(superHero);
    robotCardStats = superHero;
    setRobotCard(superHero);
  });
};

// Setting Cards
const setUserCard = (superHero) => {
  const userCardDiv = `
  <div class="innerCard UserInnerCard">
    <div class="frontSide">
      <div class="heroImage">
        <img src=${superHero.info.image} alt="" />
    </div>
    <div class="hero-info">
    <li>Name : <span class="value">${superHero.info.name}</span></li>
    <li class="trait">
        Intelligence : <span class="value">${superHero.powerstats.intelligence}</span>
      </li>
      <li class="trait">
        Strength : <span class="value">${superHero.powerstats.strength}</span>
      </li>
      <li class="trait">
        Speed : <span class="value">${superHero.powerstats.speed}</span>
      </li>
      <li class="trait">
        Durability : <span class="value">${superHero.powerstats.durability}</span>
      </li>
      <li class="trait">
        Power : <span class="value">${superHero.powerstats.power}</span>
      </li>
      <li class="trait">
        Combat : <span class="value">${superHero.powerstats.combat}</span>
      </li>
    </div>
  </div>
<div class="backSide"></div>
`;
  userCard.innerHTML = userCardDiv;

  isUser % 2 !== 0 ? displayUserCard() : "";
};

const setRobotCard = (superHero) => {
  const robotCardDiv = `
  <div class="innerCard RobotInnerCard">
    <div class="frontSide">
      <div class="heroImage">
        <img src=${superHero.info.image} alt="" />
    </div>
    <div class="hero-info">
    <li>Name : <span class="value">${superHero.info.name}</span></li>
    <li class="trait">
        Intelligence : <span class="value">${superHero.powerstats.intelligence}</span>
      </li>
      <li class="trait">
        Strength : <span class="value">${superHero.powerstats.strength}</span>
      </li>
      <li class="trait">
        Speed : <span class="value">${superHero.powerstats.speed}</span>
      </li>
      <li class="trait">
        Durability : <span class="value">${superHero.powerstats.durability}</span>
      </li>
      <li class="trait">
        Power : <span class="value">${superHero.powerstats.power}</span>
      </li>
      <li class="trait">
        Combat : <span class="value">${superHero.powerstats.combat}</span>
      </li>
    </div>
  </div>
<div class="backSide"></div>
`;
  robotCard.innerHTML = robotCardDiv;

  isUser % 2 == 0 ? selectrobotValue(superHero) : "";
};

function selectrobotValue(superHero) {
  const maxStatValue = Math.max(
    parseInt(superHero.powerstats.combat),
    parseInt(superHero.powerstats.durability),
    parseInt(superHero.powerstats.intelligence),
    parseInt(superHero.powerstats.power),
    parseInt(superHero.powerstats.speed),
    parseInt(superHero.powerstats.strength)
  );

  // Find the key corresponding to the maximum value
  const maxStatKey = Object.keys(superHero.powerstats).find(
    (key) => superHero.powerstats[key] === maxStatValue.toString()
  );
  console.log("Max State : ", maxStatKey);
  robotChoice = maxStatKey;
  robotPowerFullStat =
    maxStatValue === NaN || undefined ? "null" : Number(maxStatValue);

  // robotPowerFullStat = maxStatValue;

  console.log("Robot Choice : ", robotChoice);
  console.log("Robot Powerfull Stat : ", robotPowerFullStat);

  calculateRobotsTurn();
}

function calculateRobotsTurn() {
  hideRobotCard();
  hideUserCard();
  alert("Robot Choose : " + robotChoice);

  userPowerFullStat = Number(userCardStats.powerstats[robotChoice]);

  console.log("User Powerfull Stat ", userPowerFullStat);
  console.log("Robot Powerfull stat ", robotPowerFullStat);

  if (!isNaN(userPowerFullStat) && !isNaN(robotPowerFullStat)) {
    if (userPowerFullStat > robotPowerFullStat) {
      alert("User Won");
      userScore++;
    } else if (userPowerFullStat === robotCardStats) {
      alert("It's Tie");
    } else {
      alert("Robot Won");
      robotScore++;
    }
  } else if (isNaN(userPowerFullStat) && isNaN(robotPowerFullStat)) {
    alert("No One Won , Selected stats are not comparible");
  } else {
    if (!isNaN(robotPowerFullStat)) {
      robotScore++;
    } else {
      userScore++;
    }
  }

  userScoreText.innerHTML = userScore;
  robotScoreText.innerHTML = robotScore;

  displayUserCard();
  displayRobotCard();

  setTimeout(() => {
    displayResult();
    showBtn.style.display = "none";
  }, 1000);

  isUser++;

  console.log(`User : ${userScore}, Robot : ${robotScore}`);
}

// Display And Hide FUnction
function displayUserCard() {
  const userInnerCard = document.querySelector(".UserInnerCard");
  userInnerCard.style.transform = "rotateY(180deg)";
}

function hideUserCard() {
  const userInnerCard = document.querySelector(".UserInnerCard");
  userInnerCard.style.transform = "rotateY(0deg)";
}

function displayRobotCard() {
  const robotInnerCard = document.querySelector(".RobotInnerCard");
  robotInnerCard.style.transform = "rotateY(180deg)";
}

function hideRobotCard() {
  const robotInnerCard = document.querySelector(".RobotInnerCard");
  robotInnerCard.style.transform = "rotateY(0deg)";
}

function displayResult() {
  drawCard.style.display = "flex";
  showBtn.style.display = "none";
}

function hideResult() {
  drawCard.style.display = "none";
}

function displayPlayAgain(winner) {
  document.querySelector(".winnerText").innerHTML = winner;
  document.querySelector(".finalResult").style.display = "flex";
}

function hidePlayAgain() {
  document.querySelector(".finalResult").style.display = "none";
}

// Loader
function loader() {
  const innerCard = document.querySelector(".innerCard");
  innerCard.style.backgroundImage = "url('./images/CardBackgroundImage.jpeg')";
  innerCard.style.backgroundRepeat = "no-repeat";
  innerCard.style.backgroundSize = "cover";
  innerCard.style.display = "flex";

  innerCard.style.justifyContent = "center";
  innerCard.style.alignItems = "center";
  innerCard.style.border = "2px solid white";
  innerCard.style.borderRadius = "10px";

  innerCard.innerHTML = "Loading...";
}

// Play Game

function playGame() {
  hideRobotCard();
  hideUserCard();

  getUserCard();
  getRobotCard();

  isOver();

  if (isUser % 2 !== 0) {
    document.querySelector("select").style.display = "block";
    showBtn.style.display = "block";
  } else {
    document.querySelector("#trait").style.display = "none";
    showBtn.style.display = "none";
    drawCard.style.display = "none";
  }
}

// To check if game is over
function isOver() {
  if (userScore === 5 ) {
    displayPlayAgain("User Won");
    return;
  }
  if (robotScore === 5) {
    displayPlayAgain("Robot Won");
    return;
  }
}

// API

async function getCard(id) {
  let headersList = {
    Accept: "*/*",
    mode: "no-cors",
  };

  try {
    const res = await fetch(base_url + id, {
      method: "GET",
      headers: headersList,
    });

    if (!res.ok) {
      throw new Error("Error : Error Fetching Data");
    }

    const textData = await res.text();

    const jsonData = await JSON.parse(textData);

    return {
      info: {
        name: jsonData.name,
        image: jsonData.image.url,
      },
      powerstats: {
        intelligence: jsonData.powerstats.intelligence,
        durability: jsonData.powerstats.durability,
        power: jsonData.powerstats.power,
        speed: jsonData.powerstats.speed,
        strength: jsonData.powerstats.strength,
        combat: jsonData.powerstats.combat,
      },
    };
  } catch (error) {
    alert(`Error : ${error}`);
    return;
  }
}
