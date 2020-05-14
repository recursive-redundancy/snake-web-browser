import {makeMatrix} from '../util/makeMatrix';
import {BOARD_PIECES} from './BOARD_PIECES';
/**
 * Keeps track of all active pieces on the board (snake pieces, food, empty spaces)
 * in a 2D array (i.e. a matrix). Allows for fast hit testing and decision making logic.
*/
export class BoardState {
  /**
   * A 2-dimensional array, or matrix, storing 'state' of the gameBoard.
   * Each element within stores a number which corresponds to a
   * BOARD_PIECES key/value pair representing which type of GameObject
   * currently resides in that position on the gameBoard.
   * @type {Array.<Array.<number>>}
   */
  stateMatrix = [];

  /**
   * Retrieves board piece at particular gameBoard world unit
   * @param {number} x x index in state matrix
   * @param {number} y y index in state matrix
   */
  getElement(x, y) {
    return this.stateMatrix[y][x];
  }

  /**
   * Reset the BoardState
   * @param {Object} world reference to parent gameBoard's world object
   */
  reset(world) {
    this.stateMatrix = makeMatrix(world.width, world.height, BOARD_PIECES.EMPTY);
  }

  /**
   * Sets element in state matrix to supplied piece
   * @param {number} x x index in state matrix
   * @param {number} y y index in state matrix 
   * @param {number} piece piece to set element to (pieces mapped from BOARD_PIECES)
   */
  setElement(x, y, piece) {
    this.stateMatrix[y][x] = piece;
  }
}