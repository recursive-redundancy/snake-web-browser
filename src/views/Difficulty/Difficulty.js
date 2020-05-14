import React, {useEffect} from 'react';
import Header from './Header';
import SecondaryView from '../../components/SecondaryView';
import Radios from './Radios';

const Difficulty = (
  {
    selectedDifficulty, 
    handleClose, 
    handleSelect
  }
) => {
  return(
    <SecondaryView handleClose={handleClose}>
      <Header />
      <Radios handleSelect={handleSelect} 
        selectedDifficulty={selectedDifficulty} />
    </SecondaryView>
  );
}

export default Difficulty;