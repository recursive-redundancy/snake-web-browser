import PubSub from 'pubsub-js';
import {difficulty} from './difficulty';
import {food} from './food';
import {gameBoard} from './gameBoard';
import {input} from './input';
import {score} from './score';
import {snake} from './snake';

/**
 * The 'heart' of the game - loops the game logic on a set interval of time.
 * Responsible for resetting & updating game components.
 */
class GameLoop {
  hasUpdated = false;
  lastUpdateTime = 0;
  /**
   * Callback to stop window.requestAnimationFrame game loop
   * by calling window.cancelAnimationFrame with this property
   */
  stopAnimationFrame;

  constructor() {
    const tknEndGame = PubSub.subscribe('GAME.END', this.subGameEnd);
    const tknPauseGame = PubSub.subscribe('GAME.PAUSE', this.subGamePause);
    const tknUnPauseGame = PubSub.subscribe('GAME.UNPAUSE', this.subGameUnPause);
    const tknStartGame = PubSub.subscribe('GAME.PLAY', this.subGamePlay);
    const tknResize = PubSub.subscribe('RESIZE', this.subResize);
  }

  subGameEnd = () => {
    this.stop();
    PubSub.publish('GAME.FINALSCORE', score.score);
  }

  subGamePause = () => {
    this.stop();
  }

  subGameUnPause = () => {
    this.start();
  }

  subGamePlay = () => {
    this.reset();
    this.start();
  }

  subResize = () => {
    this.reScale();
  }

  reScale = () => {
    gameBoard.reScale();
    food.reScale();
    snake.reScale();
  }

  reset = function() {
    score.reset();
    input.reset();
    gameBoard.reset();
    snake.reset();
    food.reset();
  };

  start = () => {
    input.start();
    this.startGameLoop();
  }

  startGameLoop() {
    // call stopGameLoop first to clear out any previously running game loop
    this.stopGameLoop();
    this.lastUpdateTime = 0;
    this.stopAnimationFrame = window.requestAnimationFrame(this.update);
  }

  stop() {
    input.stop();
    this.stopGameLoop();
  }
  
  stopGameLoop() {
    window.cancelAnimationFrame(this.stopAnimationFrame);
  }

  /**
   * Main logic repeated in game loop
   * Responsible for all updating, decision making and redrawing of game
   */
  update = (timestamp) => {
    const deltaTime = timestamp - this.lastUpdateTime;
    if (deltaTime > difficulty.timerRate) {
      this.lastUpdateTime = timestamp;
      input.update();
      snake.update();
      gameBoard.canvas.clear();
      food.draw();
      snake.draw();
    }
    this.stopAnimationFrame = window.requestAnimationFrame(this.update);
  }
}

export const gameLoop = new GameLoop();
