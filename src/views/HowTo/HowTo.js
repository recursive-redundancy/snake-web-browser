import React from 'react';
import SecondaryView from '../../components/SecondaryView';
import Header from './Header';
import Instructions from './Instructions';

const HowTo = ({handleClose}) => {
  return(
    <SecondaryView handleClose={handleClose}>
      <Header />
      <Instructions />
    </SecondaryView>
  );
}

export default HowTo;