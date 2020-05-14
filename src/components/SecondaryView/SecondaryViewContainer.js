import React, {useEffect} from 'react';
import SecondaryView from './SecondaryView';
import GameBoard from '../../views/GameBoard/GameBoard';

const SecondaryViewContainer = ({children, className, handleClose}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.addEventListener('keyup', handleKeyUp);

    return(() => {
      document.removeEventListener('keyup', handleKeyUp);
    });
  }, []);

  const handleKeyUp = (e) => {
    // unload secondary view on escape keyup
    if (e.which == 27) {
      handleClose();
    }
  };

  return(
    <SecondaryView className={className} handleClose={handleClose}>
      {children}
    </SecondaryView>
  );
}

export default SecondaryViewContainer;