import React from 'react';
import styles from './header.module.scss';

const Header = () => {
  return(
    <div className={styles.header}>
      <h1>How To</h1>
      <p>Snake collects food pieces by making contact with food. The 
        goal is to collect as many food pieces as possible while growing
        the snake as large as possible, without allowing snake to hit 
        borders of game board or collide into itself.
      </p>
    </div>
  );
}

export default Header;