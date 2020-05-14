import {Coord} from './Coord';
import {Drawing} from './Drawing';

/**
 * Represents a piece or character of the game i.e snake or food etc
 */
export class GameObject {
  /**
   * @param {number} x x position in gameboard world units
   * @param {number} y y position in gameboard world units
   * @param {string} fillColor color to fill with e.g "red", "#00ff00", "rgb(0,0,0)" etc
   * @param {number} boardPiece a number corresponding to key/value pair from 
   *     BOARD_PIECES constant representing the type of boardPiece GameObject
   *     represents.
   */
  constructor(x, y, fillColor, boardPiece) {
    this.boardPiece = boardPiece;
    this.position = new Coord(x, y);
    this.drawing = new Drawing(fillColor);
  }

  /**
   * Clear gameObject instance's graphic on gameBoard canvas
   * @param {Coord} position gameObject's position
   */
  clear() {
    this.drawing.clear(this.position);
  }

  /**
   * Draw gameObject instance's graphic on gameBoard canvas
   * @param {Coord} position gameObject's position
   */
  draw() {
    this.drawing.draw(this.position);
  }

  reScale() {
    this.position.reScale();
    this.drawing.reScale();
    this.draw();
  }

  update() {}
}