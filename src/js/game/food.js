import PubSub from 'pubsub-js';
import {GameObject} from './GameObject';
import {gameBoard} from './gameBoard';
import {random} from './util/random';
import {snake} from './snake';
import {BOARD_PIECES} from './gameBoard/BOARD_PIECES';
import { Coord } from './GameObject/Coord';

/**
 * Represents piece of food on gameboard that snake attempts to collect
 */
class Food extends GameObject {
  constructor() {
    super(0, 0, "rgba(180, 160, 0, 1)", BOARD_PIECES.FOOD);

    const tknCollect = PubSub.subscribe('FOOD.COLLECT', this.subCollect);
  }

  /**
   * Called when snake collides with food i.e. snake "collects" food piece
   */
  subCollect = () => {
    this.spawn();
  }

  reset() {
    this.spawn();
    this.reScale();
  }

  /**
   * Randomly generate new spawn location for food that does not 
   * clash with any other occupied spaces on gameBoard
   */
  spawn() { 
    // only attempt to spawn if space available on board
    if (snake.pieces.length >= gameBoard.world.availablePieces) return;

    let x, 
        y, 
        boardPiece;
    do {
      x = random(gameBoard.world.rect.x1, gameBoard.world.rect.x2);
      y = random(gameBoard.world.rect.y1, gameBoard.world.rect.y2);
      boardPiece = gameBoard.boardState.getElement(x, y);
    } while (boardPiece != BOARD_PIECES.EMPTY);

    this.position.x = x;
    this.position.y = y;
    gameBoard.boardState.setElement(x, y, this.boardPiece);
  }
}

export const food = new Food();