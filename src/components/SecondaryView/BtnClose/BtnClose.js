import PubSub from 'pubsub-js';
import React from 'react';
import Button from '../../Button';
import styles from './btn-close.module.scss';

const BtnClose = ({handleClose}) => {
  return(
    <Button className={styles.close} onClick={handleClose} text="X" />
  );
}

export default BtnClose;