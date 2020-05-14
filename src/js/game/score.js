import PubSub from 'pubsub-js';

/**
 * Maintains game's score
 */
class Score {
  score = 0;

  constructor() {
    const tknFoodCollect = PubSub.subscribe('FOOD.COLLECT', this.subFoodCollect);
  }

  reset() {
    this.score = 0;
  }
  
  subFoodCollect = () => {
    this.score += 1;
    PubSub.publish('SCORE.UPDATE', this.score);
  }
}

export const score = new Score();