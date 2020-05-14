/**
 * Keeps a reference to the HTML5 Canvas on which game is drawn
 * and logic related to the canvas such a sizing the Canvas on the DOM.
 */
export class GameCanvas {
  domCanvas;
  domCanvasCtx;
  height;
  width;
  pixelRatio;

  clear() {
    this.domCanvasCtx.clearRect(0, 0, this.domCanvas.width, this.domCanvas.height);
  }

  /**
   * Re-sizes the actual Canvas element in the DOM to fit properly in browser window
   * @param {World} world reference to parent gameBoard's world
   */
  reScale(world) {
    let canHeight = window.innerHeight,
        canWidth = window.innerWidth;
  
    let screenWorldRatio;
    /**
     * Find ratio of canvas to game world - Use Math.floor to keep dimensions 
     * in whole integer units so canvas drawing doesn't use floats and 
     * therefore avoids antialiasing the graphics and making them appear blurry.
     * We will then resize the DOM canvas to a size that divides into segments
     * evenly by gameBoard's world size, thereby giving a clean & even grid
     * with which to translate the game's state to the canvas
    */
    // Screen width is larger than height, so limit canvas dimensions by height
    if (canWidth > canHeight) {
      screenWorldRatio = Math.floor(canHeight / world.height);
      canHeight = canWidth = screenWorldRatio * world.height;
    } 
    // limit canvas dimensions by width
    else {
      screenWorldRatio = Math.floor(canWidth / world.width);
      canWidth = canHeight = screenWorldRatio * world.width;
    }
    this.pixelRatio = Math.ceil(window.devicePixelRatio) || 1;
    /**
     * When device has a larger pixelRatio, or desktop browser
     * is zoomed, which creates a larger pixelRatio, drawing on
     * canvas can result in 'blurry' looking graphics.
     * To eliminate this effect, the physical canvas DOM element
     * should be sized larger than the actual css dimensions.
     * This results in more accurate drawing that eliminates
     * the blurry pixel effect.
     * 
     * When Canvas DOM width & height is changed, the entire canvas is
     * cleared, which is what we want to do on resize anyway since
     * game components will be rescaled and redrawn.
     */
    this.domCanvas.height = this.height = canHeight * this.pixelRatio;
    this.domCanvas.width = this.width = canWidth * this.pixelRatio;
    this.domCanvas.style.height = `${canHeight*.95}px`;
    this.domCanvas.style.width = `${canWidth*.95}px`;
    this.domCanvasCtx.imageSmoothingEnabled = false;
  }

  /**
   * Resets reference to game canvas & re-sizes the DOM element
   * @param {World} world reference to parent gameBoard's world
   */
  reset(world) {
    this.domCanvas = document.getElementById("canvas-game");
    this.domCanvasCtx = this.domCanvas.getContext("2d");
    this.reScale(world);
  }
}