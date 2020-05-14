import React from 'react';
import BtnResume from './BtnResume';
import styles from './popup-pause.module.scss';

const PopupPause = () => {
  return(
    <div className={styles.pause}>
      <div className={styles.container}>
        <span className={styles.pauseText}>paused</span>
        <BtnResume />
      </div>
    </div>
  )
};

export default PopupPause;