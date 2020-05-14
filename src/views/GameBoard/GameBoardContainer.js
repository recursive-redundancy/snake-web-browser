import PubSub from 'pubsub-js';
import React, {useEffect, useRef, useState} from 'react';
import GameBoard from './GameBoard';

const GameBoardContainer = () => {
  let tknGamePause,
      tknGameUnPause,
      tknScoreUpdate;

  useEffect(() => {
    window.scrollTo(0, 0);
    import(
      /* webpackChunkName: "script-game" */
      '../../js/game'
    )
    .then((res) => {
      PubSub.publish('GAME.PLAY');
      tknGamePause = PubSub.subscribe('GAME.PAUSE', subGamePause);
      tknGameUnPause = PubSub.subscribe('GAME.UNPAUSE', subGameUnPause);
      tknScoreUpdate = PubSub.subscribe('SCORE.UPDATE', subScoreUpdate);
      window.addEventListener('blur', handleBlur);
      document.addEventListener('keyup', handleKeyUp);
      window.addEventListener('resize', handleResize);
    });

    return(() => {
      PubSub.unsubscribe(tknGamePause);
      PubSub.unsubscribe(tknGameUnPause);
      PubSub.unsubscribe(tknScoreUpdate);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    });
  }, []);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const [score, setScore] = useState(0);

  const handleBlur = () => {
    PubSub.publish('GAME.PAUSE');
  };

  const handleKeyUp = (e) => {
    // pause/unpause on space or 'p' key
    if (e.which !== 32 && e.which !== 80) return;
    if (isPausedRef.current) {
      PubSub.publish('GAME.UNPAUSE');
    }
    else {
      PubSub.publish('GAME.PAUSE');
    }
  };

  const handleResize = () => {
    PubSub.publish('GAME.PAUSE');
    PubSub.publish('RESIZE');
  };

  const subGamePause = () => {
    setIsPaused(true);
  };

  const subGameUnPause = () => {
    setIsPaused(false);
  };

  const subScoreUpdate = (msg, val) => {
    setScore(val);
  };

  return(
    <GameBoard isPaused={isPaused} score={score} />
  );
};

export default GameBoardContainer;