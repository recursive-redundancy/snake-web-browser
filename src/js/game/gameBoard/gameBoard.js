import PubSub from 'pubsub-js';
import {BoardState} from './BoardState';
import {GameCanvas} from './GameCanvas';
import {Scale} from './Scale';
import {World} from './World';
import {difficulty} from '../difficulty';

/**
 * Represents the space on which the game takes place
 */
class GameBoard {
  boardState = new BoardState();
  canvas = new GameCanvas();
  scale = new Scale();
  world = new World();

  reset() {
    this.world.set(
      difficulty.diffProps.gameBoard.width,
      difficulty.diffProps.gameBoard.height
    );
    
    this.boardState.reset(this.world);
    this.canvas.reset(this.world);
    this.scale.reset(this.canvas, this.world);
  }

  reScale = () => {
    this.canvas.reScale(this.world);
    this.scale.reScale(this.canvas, this.world);
  }
}

export const gameBoard = new GameBoard();