import PubSub from 'pubsub-js';
import React from 'react';
import Button from '../../../components/Button';
import styles from './btn-pause.module.scss';

const BtnPause = () => {
  const handleClick = () => {
    PubSub.publish('GAME.PAUSE');
  };

  return(
    <div className={styles.pause}>
      <div className={styles.container}>
        <Button className={styles.button} onClick={handleClick} 
          text="||" />
      </div>
    </div>
  );
};

export default BtnPause;