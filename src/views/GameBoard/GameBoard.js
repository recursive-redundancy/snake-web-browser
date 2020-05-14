import PubSub from 'pubsub-js';
import React from 'react';
import BtnPause from './BtnPause';
import PopupPause from './PopUpPause';
import ScoreBoard from './ScoreBoard';
import styles from './gameboard.module.scss';

const GameBoard = ({isPaused, score}) => {
  return(
    <div className={['view', styles.gameboard].join(' ')}>
      <div className={styles.container}>
        <canvas id="canvas-game" width="1" height="1"></canvas>
        <ScoreBoard score={score} />
        {
          isPaused ?
            <PopupPause />
          :
            <BtnPause />
        }
      </div>
    </div>
  );
};

export default GameBoard;