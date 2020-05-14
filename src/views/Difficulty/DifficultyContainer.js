import React, {useEffect, useState, useRef} from 'react';
import Difficulty from './Difficulty';
import {difficulty} from '../../js/game/difficulty';

const DifficultyContainer = ({handleClose}) => {
  const [
    selectedDifficulty, setSelectedDifficulty
  ] = useState(difficulty.DIFF_SELECT[difficulty.difficulty]);
  const selectedDifficultyRef = useRef(selectedDifficulty);
  useEffect(() => {
    selectedDifficultyRef.current = selectedDifficulty;
    difficulty.difficulty = difficulty.DIFF_SELECT[selectedDifficultyRef.current];
  }, [selectedDifficulty]);

  const handleSelect = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  return(
    <>
      <Difficulty handleClose={handleClose} 
        selectedDifficulty={selectedDifficulty} 
        handleSelect={handleSelect} />
    </>
  );
};

export default DifficultyContainer;