import PubSub from 'pubsub-js';
import React from 'react';
import BtnPlay from './BtnPlay';
import GameOver from './GameOver';
import LinkHowTo from './LinkHowTo';
import LinkSettings from './LinkSettings';
import styles from './titlescreen.module.scss';

const TitleScreen = (
{
  lastGameScore, 
  handleHowTo, 
  handlePlayGame,
  handleSettings,
  showGameOver 
}) => 
{
  return (
    <div className={['view', styles.titlescreen].join(' ')}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>SNAKE</h1>
          </div>
        </div>
        {
          showGameOver &&
            <GameOver lastGameScore={lastGameScore} />
        }
        <div className={styles.inputGroup}>
          <BtnPlay handleClick={handlePlayGame} />
          <LinkSettings handleClick={handleSettings} />
          <LinkHowTo handleClick={handleHowTo} />
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;