const clockTime = document.getElementById("clock-time");
const btn = document.getElementById("btn");
const pomodoroStatus = document.getElementById("pomodoro-status");
const pomodoroTracker = document.getElementById("pomodoro-tracker");
const ding = document.getElementById("ding");
const click = document.getElementById("click");

const workTime = 25;  // In minutes
const restTime = 5;
let timer = null;
let timeLeft = null;
let dinging = false;

function savePomodoroState() {
  localStorage.setItem("todayPomodoro", JSON.stringify(todayPomodoro));
}

function loadPomodoroState() {
  try {
    return JSON.parse(localStorage.getItem("todayPomodoro"));
  } catch {
    return null; // fallback if corrupted
  }
}

let todayPomodoro;
let stored = loadPomodoroState();
let nowDate = new Date().toISOString().split("T")[0];

if (!stored || stored.date !== nowDate) {
  todayPomodoro = {
    date : nowDate,
    count : 0,
    isWork : false
  };
  savePomodoroState();
} else {
  todayPomodoro = stored;
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  clockTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function resetTimer() {
  todayPomodoro.isWork = !todayPomodoro.isWork;
  
  timer = null;
  if (todayPomodoro.isWork) {
    timeLeft = workTime
  } else {
    timeLeft = restTime
    if (todayPomodoro.count === 4) timeLeft *= 3;  // Complete 4 pomodoros get extra break
  }
  timeLeft *= 60;  // Convert to seconds
  pomodoroStatus.textContent = todayPomodoro.isWork ? "Work" : "Rest";
  pomodoroTracker.textContent = `${todayPomodoro.count}/4 pomodoro(s)`;
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

      if (todayPomodoro.isWork && todayPomodoro.count < 4) todayPomodoro.count++;
      else if (!todayPomodoro.isWork && todayPomodoro.count >= 4) todayPomodoro.count = 0;
      savePomodoroState();
      pomodoroTracker.textContent = `${todayPomodoro.count}/4 pomodoro(s)`;
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
    } else {
      btn.classList.replace("fa-play", "fa-pause");
      startTimer();
    }
  }
});

// Initialize display
resetTimer();
