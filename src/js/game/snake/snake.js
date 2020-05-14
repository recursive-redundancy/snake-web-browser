import PubSub from 'pubsub-js';
import {Body} from './Body';
import {Head} from './Head';
import {difficulty} from '../difficulty';
import {DIRECTION} from '../util/DIRECTION';

/**
 * Represents the player controlled Snake character
 */
class Snake {
  growthQueued = 0;
  growRate = 3;
  pieces = [];
  startPosition = {
    x: 6,
    y: 2,
    bodyLength: 3
  }

  constructor() {
    // const tknFoodCollect = PubSub.subscribe('FOOD.COLLECT', this.queueGrowth);
    const tknTurnSnake = PubSub.subscribe('SNAKE.TURN', this.turn);
  }

  /**
   * Creates a new snake with head and body pieces and puts them in the pieces property array
   */
  assembleNewSnake() {
    this.pieces.push(
      new Head(this.startPosition.x, this.startPosition.y, null)
    );
    for (let i = 1; i <= this.startPosition.bodyLength; i++) {
      this.pieces.push(
        new Body((this.startPosition.x - i), this.startPosition.y, null)
      );
    }
  }

  draw() {
    for (let i = 0; i < this.pieces.length; i++) {
      this.pieces[i].draw();
    }
  };

   /**
    * Adds or "grows" a new body piece at the tail end of snake
    * x & y arg should be the location of snake's new tail (last body piece)
    * @param {number} x x position to grow at, in gameboard world units
    * @param {number} y y position to grow at, in gameboard world units
    */
  grow(x, y) {
    if (this.growthQueued == 0) return;

    this.pieces.push(new Body(x, y));
    this.growthQueued--;
  }

  /**
   * Moves each piece of the snake from head to tail
   * allowing the snake to maintain its course
   * and each piece to follow the preceding piece
   * @returns {Object} object containing three properties: 
   *     didCollide, newTailPosition and shouldFoodCollect
   * @returns {boolean} didCollide flag indicates whether collision occurred
   * @returns {Object} newTailPosition returns x & y property describing 
   *     location where new snake piece should grow
   * @returns {boolean} shouldCollectFood flag indicating whether snake collided with 
   *     food and food needs to be collected.
   */
  moveSnake() {
    let currentPosition;
    let lastPosition;
    /**
     * Iterate snake body from head to tail, moving the following
     * piece to the position of the preceding piece, resulting in
     * the snake's body following a path along the head.
     */
    for (let i = 0; i < this.pieces.length; i++) {
      // move head piece
      if (i == 0) {
        lastPosition = {
          x: this.pieces[0].position.x,
          y: this.pieces[0].position.y
        }
        var {didCollide, shouldCollectFood} = this.pieces[0].update();
        if (didCollide) {
          return {
            didCollide: true,
            newTailPosition: null,
            shouldCollectFood: false
          }
        }
      }
      // move body piece
      else {
        currentPosition = {
          x: lastPosition.x,
          y: lastPosition.y
        }
        lastPosition = {
          x: this.pieces[i].position.x,
          y: this.pieces[i].position.y
        }
        if (this.pieces[0].direction != null) {
          this.pieces[i].update(currentPosition.x, currentPosition.y);
        }
        else {
          this.pieces[i].update(lastPosition.x, lastPosition.y);
        }
      }
    }

    return {
      didCollide: false,
      newTailPosition: lastPosition,
      shouldCollectFood: shouldCollectFood
    };
  }

  queueGrowth = () => {
    this.growthQueued += this.growRate;
  }

  reScale() {
    this.pieces.forEach(piece => {
      piece.reScale();
    });
  }

  reset() {
    this.pieces = [];
    this.growRate = difficulty.diffProps.snakeGrowRate;
    this.growthQueued = 0;
    this.assembleNewSnake();
  }

  /**
   * Re-directs or 'turns' to a new direction
   * @param {string} msg supplied by pubsub callback - string representing message published
   * @param {DIRECTION} direction direction the snake should turn
   */
  turn = (msg, direction) => {
    // don't need to turn if new direction is in direction currently moving
    if (direction == this.pieces[0].direction) return;
    
    const snakeDirection = this.pieces[0].direction;
    /**
     * On start, snake has no direction, sitting still, with body
     * placed to left of head - don't let turn left on itself. 
     */
    if (snakeDirection == null && direction == DIRECTION.LEFT) return;

    // if snake has a body, don't let it turn upon itself
    if (this.pieces.length > 1) {
      if (
        direction == DIRECTION.LEFT && 
        snakeDirection == DIRECTION.RIGHT
      ) return;
      if (
        direction == DIRECTION.RIGHT && 
        snakeDirection == DIRECTION.LEFT
      ) return;
      if (
        direction == DIRECTION.UP && 
        snakeDirection == DIRECTION.DOWN
      ) return;
      if (
        direction == DIRECTION.DOWN && 
        snakeDirection == DIRECTION.UP
      ) return;
    }

    // set head's direction to new direction
    this.pieces[0].direction = direction;
  }

  /**
   * Updates snake pieces position and does hit testing
   * as well as growing of new tail piece
   */
  update() {
    const {
      didCollide, 
      newTailPosition, 
      shouldCollectFood
    } = this.moveSnake();

    if (didCollide) {
      PubSub.publish('GAME.END');
      return;
    };

    /**
     * Queue any new growth before food collection
     * since we want to grow the new snake piece and
     * place it on the gameboard before collecting
     * and spawning a new piece of food
     */
    if (shouldCollectFood) {
      this.queueGrowth();
    }

    this.grow(newTailPosition.x, newTailPosition.y);
    
    /**
     * Call food collection AFTER entire snake has updated its position
     * so that a properly empty position on board can be located for spawn
     */
    if (shouldCollectFood) {
      /**
       * Publish synchronously so food collects and re-spawns immediately
       * since we don't want anything else to update before spawning food
       * finds an empty board piece to spawn and reside in.
       */
      PubSub.publishSync('FOOD.COLLECT');
    }
  }
}

export const snake = new Snake();