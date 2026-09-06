const TOTAL_ROUNDS = 5;
const elements = {
  target: document.querySelector('#target'), timer: document.querySelector('#timer'), timerNote: document.querySelector('#timerNote'),
  mainButton: document.querySelector('#mainButton'), restartButton: document.querySelector('#restartButton'), result: document.querySelector('#result'),
  score: document.querySelector('#score'), round: document.querySelector('#round'), combo: document.querySelector('#combo')
};

let state;

function randomTarget() { return Math.floor(Math.random() * 6) + 5; }
function freshState() { return { playing: false, startTime: 0, target: randomTarget(), score: 0, round: 1, combo: 0, perfects: 0, frame: null, finished: false }; }

function render() {
  elements.target.textContent = state.finished ? 'GAME COMPLETE' : `TARGET ${state.target} SECONDS`;
  elements.score.textContent = state.score;
  elements.round.textContent = `${Math.min(state.round, TOTAL_ROUNDS)} / ${TOTAL_ROUNDS}`;
  elements.combo.textContent = state.combo;
}

function setResult(message, kind = '') {
  elements.result.textContent = message;
  elements.result.className = `result ${kind}`;
}

function startTimer() {
  if (state.finished) return;
  state.playing = true;
  state.startTime = performance.now();
  elements.mainButton.textContent = 'STOP';
  elements.timer.textContent = '0.00';
  elements.timer.classList.remove('is-hidden');
  elements.timerNote.hidden = true;
  setResult('Watch the timer — it disappears in the final second.');
  state.frame = requestAnimationFrame(updateTimer);
}

function updateTimer(now) {
  if (!state.playing) return;
  const elapsed = (now - state.startTime) / 1000;
  elements.timer.textContent = elapsed.toFixed(2);
  if (elapsed >= state.target - 1) {
    elements.timer.classList.add('is-hidden');
    elements.timerNote.hidden = false;
  }
  state.frame = requestAnimationFrame(updateTimer);
}

function grade(difference) {
  if (difference < 0.005) return { label: 'PERFECT!', points: 100, kind: 'is-perfect', combo: true, perfect: true };
  if (difference < 0.10) return { label: 'GREAT!', points: 80, kind: 'is-great', combo: true };
  if (difference < 0.30) return { label: 'GOOD', points: 50, kind: 'is-great' };
  if (difference < 0.50) return { label: 'BAD', points: 30, kind: 'is-miss' };
  return { label: 'MISS', points: 2, kind: 'is-miss' };
}

function stopTimer() {
  if (!state.playing) return;
  state.playing = false;
  cancelAnimationFrame(state.frame);
  const elapsed = (performance.now() - state.startTime) / 1000;
  const difference = Math.abs(state.target - elapsed);
  const result = grade(difference);
  state.score += result.points;
  state.combo = result.combo ? state.combo + 1 : 0;
  state.perfects += result.perfect ? 1 : 0;
  elements.timer.classList.remove('is-hidden');
  elements.timerNote.hidden = true;
  elements.timer.textContent = elapsed.toFixed(2);
  elements.mainButton.textContent = 'START';
  setResult(`${result.label}  +${result.points}  ·  OFF BY ${difference.toFixed(2)}s`, result.kind);
  state.round += 1;
  if (state.round > TOTAL_ROUNDS) {
    state.finished = true;
    elements.mainButton.disabled = true;
    setResult(`GAME OVER — ${state.score} POINTS · ${state.perfects} PERFECT${state.perfects === 1 ? '' : 'S'}`, 'is-perfect');
  } else state.target = randomTarget();
  render();
}

function toggleTimer() { state.playing ? stopTimer() : startTimer(); }
function restartGame() { if (state?.frame) cancelAnimationFrame(state.frame); state = freshState(); elements.mainButton.disabled = false; elements.mainButton.textContent = 'START'; elements.timer.textContent = '0.00'; elements.timer.classList.remove('is-hidden'); elements.timerNote.hidden = true; setResult('Press START. The timer disappears one second before the target.'); render(); }

elements.mainButton.addEventListener('click', toggleTimer);
elements.restartButton.addEventListener('click', restartGame);
document.addEventListener('keydown', (event) => { if (event.code === 'Space' && !event.repeat && event.target === document.body) { event.preventDefault(); toggleTimer(); } });
restartGame();
