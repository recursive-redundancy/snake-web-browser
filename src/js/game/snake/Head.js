import PubSub from 'pubsub-js';
import {GameObject} from '../GameObject';
import {gameBoard} from '../gameBoard';
import {BOARD_PIECES} from '../gameBoard/BOARD_PIECES';
import {DIRECTION} from '../util/DIRECTION';

/**
 * Represents the snake's head piece
 */
export class Head extends GameObject {
  /**
   * @param {number} x x position in gameboard world units
   * @param {number} y y position in gameboard world units
   * @param {DIRECTION} direction the direction that should move
   */
  constructor(x, y, direction) {
    const fillColor = "rgba(10, 120, 30, 1)";
    super(x, y, fillColor, BOARD_PIECES.SNAKE_HEAD);

    this.direction = direction;
    gameBoard.boardState.setElement(x, y, this.boardPiece);
  }

  /**
   * Determines if a piece on the gameBoard, located at x & y, is
   * at or beyond the gameBoard's 'wall' i.e. beyond its bounds
   * @param {number} x x position, in world units, to check on gameBoard
   * @param {number} y y position, in world units, to check on gameBoard
   */
  hitTestWall(x, y) {
    const didCollideWall = (
      x < gameBoard.world.rect.x1 || 
      x > gameBoard.world.rect.x2 || 
      y < gameBoard.world.rect.y1 || 
      y > gameBoard.world.rect.y2
    );
    if (didCollideWall) return true;

    return false;
  }

  /**
   * Updates position on gameboard in accordance with its direction
   * @returns {Object} two properties: didCollide & shouldCollectFood
   * @returns {boolean} didCollide flag inidicating whether collision occurred
   * @returns {boolean} shouldCollectFood flag indicating whether snake collided
   *     with food and therefore food collect should happen
   */
  update() {
    let newX = this.position.x;
    let newY = this.position.y;
    let shouldCollectFood = false;

    // calculate where new location will be
    switch (this.direction) { 
      case DIRECTION.RIGHT:
        newX += 1;
        break;
      case DIRECTION.LEFT:
        newX -= 1;
        break;
      case DIRECTION.DOWN:
        newY += 1;
        break;
      case DIRECTION.UP:
        newY -= 1;
        break;
    }

    /**
     * Do didCollideWall check first since will be examining the head's new position
     * and if we check the position beyond the gameboard's 'wall' it will be
     * checking out of bounds and throw an error, so we avoid out of bounds error
     * by performing this check first.
     */
    const didCollideWall = this.hitTestWall(newX, newY);
    if (didCollideWall) {
      return {
        didCollide: true,
        shouldCollectFood: false
      };
    }

    const newPositionBoardPiece = gameBoard.boardState
      .getElement(newX, newY);

    const didCollideBody = (
      newPositionBoardPiece == BOARD_PIECES.SNAKE_BODY
    );
    if (didCollideBody) {
      return {
        didCollide: true,
        shouldCollectFood: false
      };
    }

    if (newPositionBoardPiece == BOARD_PIECES.FOOD) {
      shouldCollectFood = true;
    }

    gameBoard.boardState.setElement(
      this.position.x, this.position.y, BOARD_PIECES.EMPTY
    );
    this.position.x = newX;
    this.position.y = newY;
    gameBoard.boardState.setElement(newX, newY, this.boardPiece);

    return {
      didCollide: false,
      shouldCollectFood: shouldCollectFood
    };
  }
}