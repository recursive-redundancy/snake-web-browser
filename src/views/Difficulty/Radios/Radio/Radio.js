import React from 'react';
import styles from './radio.module.scss';

const Radio = (
  {
    handleSelect, 
    label, 
    value, 
    selectedDifficulty
  }
) => {
  const id = `diff-${value}`;
  return(
    <div className={styles.radio}>
      <div className={styles.row}>
        <input type="radio" className="radio-diff"
          id={id} value={value} onChange={handleSelect} 
          checked={selectedDifficulty === value} />
        <label for={id}>{label}</label>
      </div>
    </div>
  )
};

export default Radio;