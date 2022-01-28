const BG_COLOR = "#000";
const DRAW_COLOR = "#fff";

class GameObject {
  /**
   * @type {number}
   */
  x;

  /**
   * @type {number}
   */
  y;

  /**
   * @type {number}
   */
  w;

  /**
   * @type {number}
   */
  h;

  /**
   * @type {'player' | 'enemy' | 'ball'}
   */
  id;
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {'player' | 'enemy'} id
 * @returns {GameObject}
 */
const Paddle = (x, y, id) => ({
  x,
  y,
  w: 5,
  h: 50,
  id,
});

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {GameObject}
 */
const Ball = (x, y) => ({
  x,
  y,
  w: 5,
  h: 5,
  id: "ball",
});

class GameState {
  /**
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * @type {AudioContext}
   */
  actx;

  /**
   * @type {number}
   */
  width;

  /**
   * @type {number}
   */
  height;

  /**
   * @type {number}
   */
  aspectRatio;

  /**
   * @type {GameObject[]}
   */
  gameObjects;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {string} col
 * @returns {void}
 */
function drawColorFillRect(ctx, x, y, w, h, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
}
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {string} col
 * @returns {void}
 */
function drawColorLineRect(ctx, x, y, w, h, col) {
  ctx.strokeStyle = col;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 2, h - 2);
}

function resizeGame(gameState) {
  const { canvas, aspectRatio } = gameState;
  const windowAspectRatio = window.innerWidth / window.innerHeight;
  if (windowAspectRatio > aspectRatio) {
    canvas.style.height = "100%";
    canvas.style.width = "auto";
  } else {
    canvas.style.width = "100%";
    canvas.style.height = "auto";
  }
}

function init(gameState) {
  gameState.canvas.width = 640;
  gameState.canvas.height = 360;
  resizeGame(gameState);
}

function clearScreen(ctx) {
  drawColorFillRect(ctx, 0, 0, canvas.width, canvas.height, BG_COLOR);
}

/**
 *
 * @param {AudioContext} actx
 * @param {number} frequency
 * @param {'sine' | 'triangle' | 'square' | 'sawtooth'} type
 * @param {number} volume
 * @param {number} timeout
 */
function soundEffect(
  actx, // audio context
  frequency = 200, //The sound's fequency pitch in Hertz
  type = "sine", //waveform type: "sine", "triangle", "square", "sawtooth"
  volume = 1, //The sound's maximum volume
  timeout = 2 //A number, in seconds, which is the maximum duration for sound effects
) {
  const oscillator = actx.createOscillator();
  const volumeNode = actx.createGain();

  oscillator.connect(volumeNode);
  volumeNode.connect(actx.destination);

  oscillator.type = type;

  oscillator.frequency.value = frequency;
  volumeNode.gain.value = volume;

  oscillator.start(actx.currentTime);
  oscillator.stop(actx.currentTime + timeout);
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
function drawFieldOutline(ctx) {
  drawColorLineRect(ctx, 0, 0, canvas.width, canvas.height, DRAW_COLOR);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {GameObject} rect
 */
function drawGameObject(ctx, rect) {
  const { x, y, w, h } = rect;
  drawColorFillRect(ctx, x, y, w, h, DRAW_COLOR);
}

/**
 *
 * @param {GameState} gameState
 * @param {number} dt
 */
function update(gameState, dt) {}

/**
 *
 * @param {GameState} gameState
 */
function draw(gameState) {
  clearScreen(gameState.ctx);
  drawFieldOutline(gameState.ctx);
  gameState.gameObjects.forEach(obj => drawGameObject(gameState.ctx, obj));
}

function runGame() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById("canvas");

  const ctx = canvas.getContext("2d");

  const actx = new AudioContext();

  const width = 640;
  const height = 360;

  let lastFrame = 0;

  const aspectRatio = width / height;

  const player = Paddle(10, 10, "player");

  const enemy = Paddle(625, 10, "enemy");

  const ball = Ball(320, 180);
  const gameObjects = [player, enemy, ball];

  /**
   * @type {GameState}
   */
  const gameState = {
    canvas,
    ctx,
    actx,
    width,
    height,
    aspectRatio,
    gameObjects,
  };
  init(gameState);
  clearScreen(gameState.ctx);
  soundEffect(actx, 140, "square", 0.5, 0.1);
  window.addEventListener("resize", () => resizeGame(gameState));
  window.requestAnimationFrame(step);

  /**
   *
   * @param {number} timestamp
   */
  function step(timestamp) {
    const dt = timestamp - lastFrame;

    lastFrame = timestamp;

    update(gameState, dt / 1000);
    draw(gameState);

    window.requestAnimationFrame(step);
  }
}

runGame();
