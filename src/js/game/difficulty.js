/**
 * Difficulty class contains logic related to game's difficulty settings
 */
class Difficulty {
  _difficulty = 0;
  get difficulty() {
    return this._difficulty;
  }
  set difficulty(diff) {
    if (diff != this.DIFF_SELECT.easy 
      && diff != this.DIFF_SELECT.medium 
      && diff != this.DIFF_SELECT.hard) {
        this._difficulty = this.DIFF_SELECT.medium;
        return;
    }
    this._difficulty = diff;
    this.saveLocalStorage();
  }

  /**
   * Retrieves the timerRate of the currently set difficulty (this.difficulty prop)
   * Which is the frequency interval used to update the gameLoop
   */
  get timerRate() {
    return this.DIFF_PROPS[this.DIFF_SELECT[this.difficulty]].timerRate;
  }

  /**
   * Retrieves the difficulty settings properties from the currently
   * set difficulty (the this.difficulty property)
   */
  get diffProps() {
    return this.DIFF_PROPS[this.DIFF_SELECT[this.difficulty]]; 
  }

  /** Key/Value mapping for difficulty selection */
  DIFF_SELECT = {
    0: "easy",
    1: "medium",
    2: "hard",
    "easy": 0,
    "medium": 1,
    "hard": 2,
  };

  /** 
   * Key/Value mapping for difficulty setting game properties
   */
  DIFF_PROPS = {
    "easy": {
      "timerRate": 200,
      "snakeGrowRate": 3,
      "gameBoard": {
        "height": 24,
        "width": 24
      }
    },
    "medium": {
      "timerRate": 120,
      "snakeGrowRate": 4,
      "gameBoard": {
        "height": 22,
        "width": 22
      }
    },
    "hard": {
      "timerRate": 80,
      "snakeGrowRate": 6,
      "gameBoard": {
        "height": 22,
        "width": 22
      }
    }
  };

  constructor() {
    this.init();
  }

  /**
   * Attempts to load difficulty setting from localStorage and
   * sets this.difficulty property to the setting.
   * Falls back to default of medium if nothing saved in localStorage.
   */
  init() {
    let diff = null;
    if (localStorage) {
        diff = parseInt(localStorage.getItem("difficulty"));
    }
    if (diff == null || isNaN(diff)) {
        diff = this.DIFF_SELECT.medium;
    } 
    this.difficulty = diff;
  }

  /**
   * Save the current property in this.difficulty to LocalStorage
   */
  saveLocalStorage() {
    if (!localStorage) return;

    localStorage.setItem('difficulty', this.difficulty);
  }
}

export const difficulty = new Difficulty();