import PubSub from 'pubsub-js';
import React from 'react';
import styles from './link-settings.module.scss';

const LinkSettings = ({handleClick}) => {
  return(
    <div className={styles.settings}>
      <a onClick={handleClick}>Settings</a>
    </div>
  );
}

export default LinkSettings;