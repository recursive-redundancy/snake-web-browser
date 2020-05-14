/**
 * Creates and returns a matrix (2D array)
 * optionally fill matrix as well
 * @param {number} sizeX number of matrix columns
 * @param {number} sizeY number of matrix rows
 * @param {*} fillWith content to fill matrix elements with, defaults to null
 */
export function makeMatrix(sizeX, sizeY, fillWith = null) {
  let matrix = Array(sizeY).fill(fillWith)
    .map(
      () => Array(sizeX).fill(fillWith)
    )
  ;

  return matrix;
}