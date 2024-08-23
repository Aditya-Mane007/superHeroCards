// import axios from "./node_modules/axios";
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
  getUserInfo() {
    return JSON.parse(localStorage.getItem("User"));
  }
  removeUserInfo() {
    return localStorage.removeItem("User");
  }
}

const base_url =
  "https://superheroapi.com/api/d67d75e611f0ac485e4fcf7f7e412f32/";

const ruleBtn = document.querySelector(".rules-btn");
const ruleCloseBtn = document.querySelector("#ruleCloseBtn");
const ruleModal = document.querySelector("#rules-modal");
const startBtn = document.querySelector(".start-btn");
const logout = document.querySelector(".logout");
let isUser = 5;
let user;

// Screens
const infoSection = document.querySelector(".info-section");
const startGame = document.querySelector(".startGame-section");
const playArea = document.querySelector(".play-section");

// Cards
const userCard = document.querySelector("#userCard");

// Event Listeners
startBtn.addEventListener("click", () => {
  const userInnerCard = document.querySelector(".UserInnerCard");
  playArea.style.display = "flex";
  startGame.style.display = "none";
  const body = document.querySelector("body");
  body.style.backgroundImage = "url('./Images/BattleBackground.jpeg')";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "100% 100%";

  //
  if (isUser % 2 !== 0) {
    userInnerCard.style.transform = "rotateY(180deg)";
    document.querySelector("select").style.display = "block";
  } else {
    userInnerCard.style.transform = "rotateY(0deg)";
    document.querySelector("select").style.display = "none";
  }

  getUserCard();
});

logout.addEventListener("click", () => {
  checkForUser();
  if (user) {
    user.removeUserInfo();
  }
});

ruleBtn.addEventListener("click", () => {
  ruleModal.style.display = "flex";
});

ruleCloseBtn.addEventListener("click", () => {
  ruleModal.style.display = "none";
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

function init() {
  checkForUser();
}
init();

// Form Submission
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.querySelector(".nameInput");
  const message = form.querySelector(".message");

  if (!name.value) {
    message.style.display = "block";
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

// API CALLS
const getUserCard = async () => {
  const id = Math.floor(Math.random() * 731);
  const url = String(base_url + id);

  let headersList = {
    Accept: "*/*",
    mode: "no-cors",
  };

  const response = await fetch(url, {
    method: "GET",
    headers: headersList,
  });

  console.log(response);

  const data = await response.text();

  console.log(JSON.parse(data));

  // const res = await axios.get(base_url + id, {
  //   method: "GET",
  //   mode: "no-cors",
  // });

  // const resData = res.data();

  // console.log(resData);
  // try {
  //   const res = await axios.get(base_url + id, {
  //     method: "GET",
  //     mode: "no-cors",
  //   });

  //   console.log(res);

  //   if (!res.ok) {
  //     console.error(`Error fetching data: ${res.status}`);
  //     return;
  //   }

  //   const data = await res.text();
  //   console.log(data);
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  // }
};
