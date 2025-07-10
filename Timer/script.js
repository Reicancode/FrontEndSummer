let timer = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");

let inputHours = document.getElementById("inputHours");
let inputMinutes = document.getElementById("inputMinutes");
let inputSeconds = document.getElementById("inputSeconds");

let seconds = 0;
let minutes = 15;
let hours = 0;
let interval;

function updateTime() {
  --seconds;
  if (seconds === -1) {
    --minutes;
    seconds = 59;
  }
  if (minutes === -1 && hours > 0) {
    --hours;
    minutes = 59;
  }

  if (hours === 0 && minutes === 0 && seconds === 0) {
    clearInterval(interval);
    startBtn.disabled = false;
    resetBtn.disabled = true;
    alert("Время вышло!");
  }

  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener("click", () => {
  hours = parseInt(inputHours.value) || 0;
  minutes = parseInt(inputMinutes.value) || 0;
  seconds = parseInt(inputSeconds.value) || 0;

  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  interval = setInterval(updateTime, 1000);
  startBtn.disabled = true;
  resetBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  seconds = 0;
  minutes = 0;
  hours = 0;
  timer.textContent = "00:00:00";
  startBtn.disabled = false;
  resetBtn.disabled = true;
});
