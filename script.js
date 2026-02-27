const clockTime = document.getElementById("clock-time");
const btn = document.getElementById("btn");
const ding = document.getElementById("ding");
const click = document.getElementById("click");

const workTime = 25;  // In minutes
const restTime = 5;
let isWork = false;
let timer = null;
let timeLeft = null;
let dinging = false;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  clockTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function resetTimer() {
  isWork = !isWork;
  console.log(isWork);
  timer = null;
  timeLeft = (isWork ? workTime : restTime) * 60;  // Convert to seconds
  updateDisplay();
}

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      ding.play();
      clearInterval(timer);
      timer = null;

      dinging = true;
      btn.classList.replace("fa-pause", "fa-x");
      ding.play();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

btn.addEventListener("click", () => {
  click.play();
  if (dinging) {
    dinging = false;
    ding.pause();
    ding.currentTime = 0;
    btn.classList.replace("fa-x", "fa-play");
    resetTimer();
  } else {
    if (timer) {
      btn.classList.replace("fa-pause", "fa-play");
      pauseTimer();
      console.log("Paused!");
    } else {
      btn.classList.replace("fa-play", "fa-pause");
      startTimer();
      console.log("Started!");
    }
  }
});

// Initialize display
resetTimer();
