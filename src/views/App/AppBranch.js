import PubSub from 'pubsub-js';
import React, {Suspense} from 'react';

const Difficulty = React.lazy(() => 
  import(
    /* webpackChunkName: "view-difficulty" */
    '../Difficulty'
  )
);
const GameBoard = React.lazy(() => 
  import(
    /* webpackChunkName: "view-gameboard" */
    '../GameBoard'
  )
);
const HowTo = React.lazy(() => 
  import(
    /* webpackChunkName: "view-howto" */
    '../HowTo'
  )
);
import TitleScreen from '../TitleScreen';

const AppBranch = (
  {
    isGamePlaying, lastGameScore, 
    handleDifficultyClose, handleHowTo, handleHowToClose, 
    handlePlayGame, handleSettings,
    showHowTo, showSettings, showGameOver,
  }
) => {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      {
        (showSettings) ?
          <Difficulty handleClose={handleDifficultyClose} />
        :
          (showHowTo) ? 
            <HowTo handleClose={handleHowToClose} />
          :
            (isGamePlaying) ?
              <GameBoard />
            :
              <TitleScreen handleHowTo={handleHowTo} 
                handlePlayGame={handlePlayGame}
                handleSettings={handleSettings}
                lastGameScore={lastGameScore} 
                showGameOver={showGameOver} />
      }
    </Suspense>
  );
};

export default AppBranch;