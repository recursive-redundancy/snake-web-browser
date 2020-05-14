import PubSub from 'pubsub-js';
import {DIRECTION} from './util/DIRECTION';

/**
 * Class for user inputs to result in game movements.
 * The directional movements are added to a queue so that 
 * no input direction will be missed or dropped.
 * Each input frame, the next move in the queue 
 * is processed and executed (if move is valid).
 */
class Input {
  moveQueue = [];
  tknGamePause;
  touch = {
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: 0,
      y: 0
    }
  };
  
  constructor() {
    this.tknGamePause = PubSub.subscribe('GAME.PAUSE', this.subGamePause);
  }

  checkForSwipe = () => {
    let direction;

    let deltaX = this.touch.end.x - this.touch.start.x;
    let deltaY = this.touch.end.y - this.touch.start.y;
    
    let absX = Math.abs(deltaX);
    let absY = Math.abs(deltaY);

    if (absX <= 0 && absY <= 0) return;

    // movement greater in x plane
    if (absX > absY) {
      if (deltaX > 0) {
        direction = DIRECTION.RIGHT;
      }
      else {
        direction = DIRECTION.LEFT;
      }
    }
    // movement greater in y plane
    else {
      if (deltaY > 0) {
        direction = DIRECTION.DOWN;
      }
      else {
        direction = DIRECTION.UP;
      }
    }

    this.queueDirection(direction);
  }

  eventsStart = function() {
    window.addEventListener("keydown", this.handleKeyDown);
    document.querySelector('#root')
      .addEventListener("touchend", this.handleTouchEnd, true);
    document.querySelector('#root')
      .addEventListener("touchstart", this.handleTouchStart, true);
    document.querySelector('#root')
      .addEventListener("touchmove", this.handleTouchMove, true);
  }

  eventsStop() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.querySelector('#root')
      .removeEventListener("touchend", this.handleTouchEnd, true);
    document.querySelector('#root')
      .removeEventListener("touchstart", this.handleTouchStart, true);
    document.querySelector('#root')
    .removeEventListener("touchmove", this.handleTouchMove, true);
  }

  handleKeyDown = (e)=>  {
    let direction = null;
    switch (e.key) {
        case "ArrowRight":
            direction = DIRECTION.RIGHT;
            break;
        case "Right":
            direction = DIRECTION.RIGHT;
            break;
        case "d":
            direction = DIRECTION.RIGHT;
            break;
        case "ArrowUp":
            direction = DIRECTION.UP;
            break;
        case "Up":
            direction = DIRECTION.UP;
            break;
        case "w":
            direction = DIRECTION.UP;
            break;
        case "ArrowLeft":
            direction = DIRECTION.LEFT;
            break;
        case "Left":
            direction = DIRECTION.LEFT;
            break;
        case "a":
            direction = DIRECTION.LEFT;
            break;
        case "ArrowDown":
            direction = DIRECTION.DOWN;
            break;
        case "Down":
            direction = DIRECTION.DOWN;
            break;
        case "s":
            direction = DIRECTION.DOWN;
            break;
    }
    if (direction != null) { // a controller direction was detected, so queue it
        this.queueDirection(direction);
    }
  }
  
  handleTouchMove = (e) => {
    // prevent user scroll
    e.preventDefault();
  }

  handleTouchEnd = (e) => {
    if (e.target.tagName.toLowerCase() == "button") return;
    
    this.touch.end.x = e.changedTouches[0].clientX;
    this.touch.end.y = e.changedTouches[0].clientY;
    e.preventDefault();
    this.checkForSwipe();
  }

  handleTouchStart = (e) => {
    if (e.target.tagName.toLowerCase() == "button") return;

    this.touch.start.x = e.changedTouches[0].clientX;
    this.touch.start.y = e.changedTouches[0].clientY;
    e.preventDefault();
  }

  /**
   * Adds direction to move queue
   */
  queueDirection = function(direction) {
    // don't add to queue if direction is same as last queued direction
    // reduces perceived input lag
    if (direction == this.moveQueue[this.moveQueue.length - 1]) return;

    this.moveQueue.push(direction);
  }

  reset() {
    this.moveQueue.length = [];
  }

  start() {
    this.eventsStart();
  }

  stop() {
    this.eventsStop();
  }

  subGamePause = () => {
    // clear move queue on pause so when resumed snake doesn't seemingly move randomly
    this.moveQueue = [];
  }

  update() {
    if (this.moveQueue.length == 0) return;

    // pub synchronously so turn is responsive rather than laggy and slow feeling
    PubSub.publishSync('SNAKE.TURN', this.moveQueue.shift());
  }
}

export const input = new Input();