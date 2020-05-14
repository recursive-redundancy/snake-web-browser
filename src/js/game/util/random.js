  /**
   * Generate a random integer in range [min - max]
   * 
   * @param {number} min minimum number that should be generated
   * @param {number} max maximum number that should be generated
   */
  export const random = (min, max) => {
    // range error - default to min value as fallback
    if (min >= max) { return min; }
    return Math.floor(min + Math.random() * max);
  }