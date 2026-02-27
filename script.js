const clockTime = document.getElementById("clock-time");
const btn = document.getElementById("btn");
const ding = document.getElementById("ding");

const workTime = 1500;
const restTime = 300;
let isWork = true;
let timer = null;
let timeLeft = workTime;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  clockTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

      // Make it ding until the user clicks the button to close it
      ding.play();

      isWork = !isWork;
      timeLeft = isWork ? workTime : restTime;
      updateDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

btn.addEventListener("click", () => {
  if (timer) {
    btn.classList.replace("fa-pause", "fa-play");
    pauseTimer();
    console.log("Paused!");
  } else {
    btn.classList.replace("fa-play", "fa-pause");
    startTimer();
    console.log("Started!");
  }
});

// Initialize display
updateDisplay();
