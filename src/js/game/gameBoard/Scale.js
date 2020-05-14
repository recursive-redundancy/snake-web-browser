/**
 * Represents a 1x1 unit scaled from world to canvas units
 */
export class Scale {
  x;
  y;

  /**
   * Re-calculates the x & y unit
   * Scale is proportionate to gameBoard's world 
   * units in relation to the HTML5 Canvas.
   * @param {GameCanvas} canvas reference to gameBoard's canvas
   * @param {World} world reference to gameBoard's world
   */
  reScale(canvas, world) {
    this.x = canvas.width / world.width;
    this.y = canvas.height / world.height;
  }

  /**
   * Resets the scale
   * @param {GameCanvas} canvas reference to gameBoard's canvas
   * @param {World} world reference to gameBoard's world
   */
  reset(canvas, world) {
    this.reScale(canvas, world);
  }
}