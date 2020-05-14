import React from 'react';
import styles from './scoreboard.module.scss';

const ScoreBoard = ({score}) => {
  return(
    <div className={styles.scoreboard}>
      <span>{score}</span>
    </div>
  );
};

export default ScoreBoard;