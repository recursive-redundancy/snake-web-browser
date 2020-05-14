import React from 'react';
import styles from './gameover.module.scss';

const GameOver = ({lastGameScore}) => {
  return(
    <>
      <div className={styles.wrapper}>
        <div className={styles.gameover}>
          <p>Final Score: <span>{lastGameScore}</span></p>
        </div>
      </div>
    </>
  );
}

export default GameOver;