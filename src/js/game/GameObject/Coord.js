import {gameBoard} from '../gameBoard';
const scale = gameBoard.scale;

/**
 * 2D x-y coordinate point (in virtual world units)
 * with built-in scaling to canvas units
 * So whenever the x-y world units are set
 * the object automatically calculates units scaled
 * to the corresponding canvas units, and vice-versa
*/
export class Coord {
  _x;
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._scaleX = value * scale.x;
  }

  _scaleX;
  get scaleX() {
    return this._scaleX;
  }
  set scaleX(value) {
    this._scaleX = value;
  }

  _y;
  get y() {
    return this._y; 
  }
  set y(value) {
    this._y = value;
    this.scaleY = value * scale.y;
  }

  _scaleY;
  get scaleY() {
    return this._scaleY;
  }
  set scaleY(value) {
    this._scaleY = value;
  }

  /**
   * @param {number} x x position in gameboard world units
   * @param {number} y y position in gameboard world units
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  reScale() {
    // re-assigning x & y causes re-calculating scale
    this.x = this.x;
    this.y = this.y;
  }

  reset() {
    this.reScale();
  }
}