/**
 * An abstraction of the gameboard's 'world' in integer units
 * which defines the dimensions of the gameboard's board state matrix.
 * World's origin starts at top-left at x-y coordinate (0, 0)
 */
export class World {
  /**
   * The total available pieces (or slots) available on the
   * gameboard. For instance, a gameBoard with width=4
   * and height=4, i.e. a 4x4 board, would have a 
   * availablePieces = 16
   * @type {number}
   */
  availablePieces = 0;
  /**
   * Represents the bounding rect of the virtual gameBoard world.
   * This rect's bounds directly translates to the bounds of the gameBoard's
   * boardState stateMatrix
   * @type {Object}
   * @property {number} x1 the left bounds of the rect (ALWAYS KEEP AT 0!!)
   * @property {number} y1 the top bounds of the rect (ALWAYS KEEP AT 0!!)
   * @property {number} x2 the right bounds of the rect
   * @property {number} y2 the bottom bounds of the rect
   */
  rect = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  };

  width;
  height;

  /**
   * Sets the dimensions of the gameBoard world.
   * Consequently, assigns the x2 and y2 properties
   * of the rect property object to correspond to new
   * dimensions of the world.
   * @param {number} width new width of the world
   * @param {number} height new height of the world
   */
  set(width, height) {
    this.availablePieces = width * height;
    this.width = width;
    this.height = height;
    this.rect.x2 = width - 1;
    this.rect.y2 = height - 1;
  }
}