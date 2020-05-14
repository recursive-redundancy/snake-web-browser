import {Coord} from './Coord';
import {gameBoard} from '../gameBoard';
const canvas = gameBoard.canvas;

/**
 * Handles the HTML5 Canvas element drawing operations for GameObject
 */
export class Drawing {
  /**
   * @param {string} fillColor color to fill with 
   *     e.g "red", "#00ff00", "rgb(0,0,0)" etc
   * @param {number} height height in gameboard world units
   * @param {number} width width in gameboard world units
   */
  constructor(fillColor, height = 1, width = 1) {
    this.fillColor = fillColor;
    this.size = new Coord(height, width);
  }

  /**
   * Clears rect on canvas
   * @param {number} x x position in gameboard world units
   * @param {number} y y position in gameboard world units
   * @param {number} width width in gameboard world units
   * @param {number} height height in gameboard world units
   */
  static clearRect(x, y, width, height) {
    /**
     * Canvas tends to leave some stray pixels when clearing rects precisely
     * so give a couple extra pixels padding to make sure it doesn't leave stray
     * borders from the rect
     */
    canvas.domCanvasCtx.clearRect(x - 2, y - 2, width + 4, height + 4);
  }

  /**
   * Draws rect on canvas
   * @param {number} x x position in gameboard world units
   * @param {number} y y position in gameboard world units
   * @param {number} width width in gameboard world units
   * @param {number} height height in gameboard world units
   * @param {string} fillColor color to fill with 
   *     e.g "red", "#00ff00", "rgb(0,0,0)" etc
   */
  static drawRect(x, y, width, height, fillColor) {
    if (fillColor == null) return;

    const ctx = canvas.domCanvasCtx;
    ctx.beginPath();
    ctx.rect(x, y, width, height); 
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.closePath();
  }

  /**
   * Clear gameObject instance's graphic on gameBoard canvas
   * @param {Coord} position gameObject's position
   */
  clear(position) {
    Drawing.clearRect(
      position.scaleX, 
      position.scaleY, 
      this.size.scaleX, 
      this.size.scaleY
    );
  }

  /**
   * Draw gameObject instance's graphic on gameBoard canvas
   * @param {Coord} position gameObject's position
   */
  draw(position)  {
    Drawing.drawRect(
      position.scaleX, 
      position.scaleY, 
      this.size.scaleX, 
      this.size.scaleY, 
      this.fillColor
    );
  }

  reScale() {
    this.size.reScale();
  }

  reset() {
    this.reScale();
  }
}