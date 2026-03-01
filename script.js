const clockTime = document.getElementById("clock-time");
const btn = document.getElementById("btn");
const pomodoroStatus = document.getElementById("pomodoro-status");
const pomodoroTracker = document.getElementById("pomodoro-tracker");
const ding = document.getElementById("ding");
const click = document.getElementById("click");

const workTime = 25 * 60 * 1000;  // In Ms
const restTime = 5 * 60 * 1000;
let remainingMs = null;
let isTimerRunning = false;
let isAlarmActive = false;

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
let savedState = loadPomodoroState();
let nowDate = new Date().toISOString().split("T")[0];

if (!savedState || savedState.date !== nowDate) {
  todayPomodoro = {
    date : nowDate,
    count : 0,
    isWorkSession : false
  };
  savePomodoroState();
} else {
  todayPomodoro = savedState;
}

function updateDisplay(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  clockTime.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function resetTimer() {
  todayPomodoro.isWorkSession = !todayPomodoro.isWorkSession;
  
  if (todayPomodoro.isWorkSession) {
    remainingMs = workTime
  } else {
    remainingMs = restTime
    if (todayPomodoro.count === 4) remainingMs *= 3;  // Complete 4 pomodoros get extra break
  }
  pomodoroStatus.textContent = todayPomodoro.isWorkSession ? "Work" : "Rest";
  pomodoroTracker.textContent = `${todayPomodoro.count}/4 pomodoro(s)`;
  updateDisplay(remainingMs);
}

function startTimer(totalMs) {
  if (isTimerRunning) return;

  isTimerRunning = true;
  const endTime = Date.now() + totalMs;

  function tick() {
    remainingMs = Math.max(0, endTime - Date.now());
    updateDisplay(remainingMs);

    if (remainingMs <= 0) {
      ding.play();

      isTimerRunning = false;
      isAlarmActive = true;
      btn.classList.replace("fa-pause", "fa-x");

      if (todayPomodoro.isWorkSession && todayPomodoro.count < 4) todayPomodoro.count++;
      else if (!todayPomodoro.isWorkSession && todayPomodoro.count >= 4) todayPomodoro.count = 0;
      savePomodoroState();
      pomodoroTracker.textContent = `${todayPomodoro.count}/4 pomodoro(s)`;
    } else {
      if (!isTimerRunning) return;
      setTimeout(tick, 250);
    }
  }

  tick();
}

function pauseTimer() {
  isTimerRunning = false;
  updateDisplay(remainingMs)
}

btn.addEventListener("click", () => {
  click.play();
  if (isAlarmActive) {
    isAlarmActive = false;
    ding.pause();
    ding.currentTime = 0;
    btn.classList.replace("fa-x", "fa-play");
    resetTimer();
  } else {
    if (isTimerRunning) {
      btn.classList.replace("fa-pause", "fa-play");
      pauseTimer();
    } else {
      btn.classList.replace("fa-play", "fa-pause");
      startTimer(remainingMs);
    }
  }
});

// Initialize display
resetTimer();
