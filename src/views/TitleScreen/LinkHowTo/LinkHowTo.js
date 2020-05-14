import PubSub from 'pubsub-js';
import React from 'react';
import styles from './link-howto.module.scss';

const LinkHowTo = ({handleClick}) => {
  return(
    <div className={styles.howto}>
      <a onClick={handleClick}>How To</a>
    </div>
  );
}

export default LinkHowTo;