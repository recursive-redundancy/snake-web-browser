import {GameObject} from '../GameObject';
import {gameBoard} from '../gameBoard';
import {BOARD_PIECES} from '../gameBoard/BOARD_PIECES';

/**
 * Represents a single piece of the snake's body
 */
export class Body extends GameObject {
  /**
   * @param {number} x x position in gameboard world units
   * @param {number} y y position in gameboard world units
   */
  constructor(x, y) {
    const fillColor = "rgba(25, 180, 50, 1)";
    super(x, y, fillColor, BOARD_PIECES.SNAKE_BODY);

    gameBoard.boardState.setElement(x, y, this.boardPiece);
  }
  
  /**
   * Updates body piece's position on gameboard
   * @param {number} x new x position in gameboard world units
   * @param {number} y new y position in gameboard world units
   */
  update(x, y) {
    gameBoard.boardState.setElement(
      this.position.x, this.position.y, BOARD_PIECES.EMPTY
    );
    this.position.x = x;
    this.position.y = y;
    gameBoard.boardState.setElement(
      this.position.x, this.position.y, this.boardPiece
    );
  }
}