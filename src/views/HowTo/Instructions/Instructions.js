import React from 'react';
import styles from './instructions.module.scss';

const Instructions = () => {
  return(
    <div className={styles.instructions}>
      <h2>Keyboard</h2>
      <ul>
        <li>UP - "w" or "up arrow"</li>
        <li>RIGHT - "d" or "right arrow"</li>
        <li>DOWN - "s" or "down arrow"</li>
        <li>LEFT - "a" or "left arrow"</li>
        <li>PAUSE - "space" or "p" key</li>
      </ul>
      <h2>Touch</h2>
      <ul>
        <li>UP - swipe finger up</li>
        <li>RIGHT - swipe finger right</li>
        <li>DOWN - swipe finger down</li>
        <li>LEFT - swipe finger left</li>
      </ul>
    </div>
  );
}

export default Instructions;