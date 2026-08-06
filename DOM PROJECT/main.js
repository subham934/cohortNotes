function openFeatures() {
  var allElems = document.querySelectorAll(".elem");
  var fullElemPage = document.querySelectorAll(".fullElem");
  var fullElemPageBackBtns = document.querySelectorAll(".fullElem .back");

  allElems.forEach((elem) => {
    elem.addEventListener("click", () => {
      fullElemPage[elem.id].style.display = "block";
    });
  });

  fullElemPageBackBtns.forEach((back) => {
    back.addEventListener("click", () => {
      //   console.log(back.id);
      fullElemPage[back.id].style.display = "none";
    });
  });
}
openFeatures();

function todoList() {
  let currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("storage empty");
  }

  function renderTask() {
    var allTask = document.querySelector(".allTask");
    var sum = "";

    currentTask.forEach((elem, idx) => {
      sum =
        sum +
        `<div class="task">
        <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
        <button id=${idx}>Mark as Completed</button>
    </div>`;
    });

    allTask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    document.querySelectorAll(".task button").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentTask.splice(btn.id, 1);
        renderTask();
      });
    });
  }
  renderTask();

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form input");
  let taskDetailInput = document.querySelector(".addTask form textarea");
  let taskCheckbox = document.querySelector(".addTask form #check");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentTask.push({
      task: taskInput.value,
      details: taskDetailInput.value,
      imp: taskCheckbox.checked,
    });
    renderTask();
    taskInput.value = "";
    taskDetailInput.value = "";
    taskCheckbox.checked = false;
  });
}
todoList();

// jab main button ko submit karta hoon , toh with the help of  localStorage.setItem("currentTask", JSON.stringify(currentTask)), maine jo bhi data currentTask pe push kiya hai, wo localStorage pe save ho jayega , but jab main reload karta hoon, toh kyuki maine currentTask pe save hua data nahi manga over the page, toh wo data JS memory se gayab ho gaya , not from localStorage memory, uss data ko display karne k liye hum use karte hain below code:

// if (localStorage.getItem("currentTask")) {
// //   console.log("Task List if full");
//     currentTask = JSON.parse(localStorage.getItem("currentTask"))
// } else {
//   console.log("Task list is empty");
// }

// jo main.js file upload kiya hai , use dhyan se read karo, aur ak cheez bolo ki agar below code nahi rehta :

// if (localStorage.getItem("currentTask")) {
// //   console.log("Task List if full");
//     currentTask = JSON.parse(localStorage.getItem("currentTask"))
// } else {
//   console.log("Task list is empty");
// }

// toh agar main kuch bhi code likhta hoon, wo toh  display ho jata hai aur localStorage main bhi save hota hai, but after writing it , lets just say i reload the page , toh since we dont have the above code , the currentTask=[] and we wont see anything on the browser, however in localStorage the data is saved, but now lets say i add some more data and submit it, then the previous data gets removed from my page and is replaced by current data , but the previous data should be saved since i used  localStorage.setItem("currentTask", JSON.stringify(currentTask)), and you said it gets saved on localStorage

// ok , i'll explain it, correct me if im wrong, so what happens is that, when the page reloads , localStorage.setItem OVERWRITE karta hai, MERGE nahi, iska matlab jab hum reload karte hai, toh JS memory empty hota hai aur localStorage me purana data pada hai main localStorage se load nahi karta (kyunki ye code hata diya, agar hota toh purana code JS memory main rehta) 👉 JS ko pata hi nahi ki localStorage me kuch hai. Phir main ek naya task add karta ho since , JS memory empty rehta hai aur currentTask = [ newTask ];❗ Old tasks yahan kabhi aaye hi nahi toh Jo currentTask abhi JS memory me hai,usko PURA localStorage me likh deta hai, iske karan jab hum naya code likhte hai, toh purana code replace hoke naya code overwrite hota hai

function dailyPlanner() {
  var dayPlanner = document.querySelector(".day-planner");

  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
  );

  var wholeDaySum = "";
  hours.forEach(function (elem, idx) {
    var savedData = dayPlanData[idx] || "";

    wholeDaySum =
      wholeDaySum +
      `<div class="day-planner-time">
    <p>${elem}</p>
    <input id=${idx} type="text" placeholder="..." value=${savedData}>
</div>`;
  });

  dayPlanner.innerHTML = wholeDaySum;

  var dayPlannerInput = document.querySelectorAll(".day-planner input");

  dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}

dailyPlanner();

function motivationalQuote() {
  var motivationQuoteContent = document.querySelector(".motivation-2 h1");
  var motivationAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    let response = await fetch("https://quotes-api-self.vercel.app/quote");
    let data = await response.json();

    motivationQuoteContent.innerHTML = data.quote;
    motivationAuthor.innerHTML = `- ${data.author}`;
  }

  fetchQuote();
}

motivationalQuote();

let timer = document.querySelector(".pomo-timer h1");
let startBtn = document.querySelector(".start-timer");
let pauseBtn = document.querySelector(".pause-timer");
let resetBtn = document.querySelector(".reset-timer");

let totalSeconds = 25 * 60;
let timerInterval = null;

function updateTimer() {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  timer.innerHTML = `${minutes}:${seconds}`;
}

function startTimer() {
  if (timerInterval !== null) return; // 🚫 prevent multiple intervals

  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      return;
    }

    totalSeconds--;
    updateTimer();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = 25 * 60; 
  updateTimer(); // 🔥 important
}

updateTimer();

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer); 