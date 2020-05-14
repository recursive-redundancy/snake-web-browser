import React from 'react';
import Radio from './Radio';
import styles from './radios.module.scss';

const Radios = ({handleSelect, selectedDifficulty}) => {
  return(
    <div className={styles.radios}>
      <Radio label='Easy' value='easy' 
        handleSelect={handleSelect} 
        selectedDifficulty={selectedDifficulty}/>
      <Radio label='Medium' value='medium' 
        handleSelect={handleSelect} 
        selectedDifficulty={selectedDifficulty}/>
      <Radio label='Hard' value='hard' 
        handleSelect={handleSelect} 
        selectedDifficulty={selectedDifficulty}/>
    </div>
  );
}

export default Radios;