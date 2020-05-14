import PubSub from 'pubsub-js';
import React from 'react';
import Button from '../../../components/Button';
import styles from './btn-play.module.scss';

const BtnPlay = ({handleClick}) => {
  return(
    <div className={styles.container}>
      <Button onClick={handleClick} text="PLAY" />
    </div>
  );
}

export default BtnPlay;