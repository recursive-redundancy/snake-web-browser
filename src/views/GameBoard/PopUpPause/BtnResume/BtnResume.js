import PubSub from 'pubsub-js';
import React from 'react';
import Button from '../../../../components/Button';
import styles from './btn-resume.module.scss';

const BtnResume = () => {
  const handleClick = () => {
    PubSub.publish('GAME.UNPAUSE');
  };

  return(
    <Button className={styles.resume} onClick={handleClick} text="RESUME" />
  );
};

export default BtnResume;