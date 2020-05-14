import PubSub from 'pubsub-js';
import React, 
  {
    useEffect, 
    useState
  } from 'react';
import AppBranch from './AppBranch';

const AppContainer = () => {
  let tknFinalScore;

  useEffect(() => {
    setRootHeight();
    tknFinalScore = PubSub.subscribe('GAME.FINALSCORE', subFinalScore);
    window.addEventListener('resize', setRootHeightDelay);

    return(() => {
      PubSub.unsubscribe(tknFinalScore);
    });
  }, []);

  const [lastGameScore, setLastGameScore] = useState(0);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleDifficultyClose = () => {
    setShowSettings(false);
  };

  const handleHowTo = () => {
    setShowHowTo(true);
  };

  const handleHowToClose = () => {
    setShowHowTo(false);
  };

  const handlePlayGame = () => {
    setIsGamePlaying(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const setRootHeightDelay = () => {
    setTimeout(setRootHeight, 200);
  }

  const setRootHeight = () => {
    document.getElementById('root').style.height = `${window.innerHeight}px`;
  };

  const subFinalScore = (msg, score) => {
    setLastGameScore(score);
    setShowGameOver(true);
    setIsGamePlaying(false);
  };

  return(
    <AppBranch handleDifficultyClose={handleDifficultyClose} 
      handleHowTo={handleHowTo} 
      handleHowToClose={handleHowToClose} 
      handlePlayGame={handlePlayGame} 
      handleSettings={handleSettings} 
      isGamePlaying={isGamePlaying} 
      lastGameScore={lastGameScore} 
      showHowTo={showHowTo} showSettings={showSettings} 
      showGameOver={showGameOver} />
  );
};

export default AppContainer;