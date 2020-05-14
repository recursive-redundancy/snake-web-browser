import PubSub from 'pubsub-js';
import React, {useEffect} from 'react';
import TitleScreen from './TitleScreen';

const TitleScreenContainer = (
{
  lastGameScore, 
  handleHowTo, 
  handlePlayGame,
  handleSettings,
  showGameOver 
}) => 
{
  useEffect(() => {
    window.scrollTo(0, 0);
    document.addEventListener('keyup', handleKeyUp);

    return(() => {
      document.removeEventListener('keyup', handleKeyUp);
    })
  }, []);

  const handleKeyUp = (e) => {
    // play game on enter key press
    if (e.which == 13) {
      handlePlayGame();
    }
  };

  return (
    <TitleScreen lastGameScore={lastGameScore} 
      handleHowTo={handleHowTo} 
      handlePlayGame={handlePlayGame} 
      handleSettings={handleSettings}
      showGameOver={showGameOver} />
  );
};

export default TitleScreenContainer;