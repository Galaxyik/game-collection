/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
const ships = {
  battleship: {
    count: 1,
    size: 5
  },
  cruiser: {
    count: 2,
    size: 4
  },
  destroyer: {
    count: 3,
    size: 3
  },
  submarine: {
    count: 4,
    size: 2
  }
};

// Calculates how many ships there are
const shipsCount = Object.keys(ships).reduce((acc, ship) => acc + ships[ship].count, 0);

const directions = {
  N: -1,
  S: 1,
  W: -1,
  E: 1
};

const neutralState = {
  possDirections: { ...directions },
  firstShotRow: 0,
  firstShotCol: 0,
  lastShotRow: 0,
  lastShotCol: 0
};

let state = null;

let enemyShipsSunk = 0;

const boardSize = 10;

const boardShots = new Array(boardSize);
const boardPieces = new Array(boardSize);

let shotRow = 0; // TODO update when shooting
let shotCol = 0;

(function main() {
  initBoards();

  shotRow = 1;
  shotCol = 2;
  hitOrMiss('HIT');
  hit();
  console.log(JSON.stringify(state));
  printBoard(boardShots);
})();

/**
 * Initializes the pieces board and the shots board with 00
 */
function initBoards() {
  for (let row = 0; row < boardSize; row++) {
    boardPieces[row] = [];
    boardShots[row] = [];

    for (let col = 0; col < boardSize; col++) {
      boardPieces[row][col] = '00';
      boardShots[row][col] = '00';
    }
  }

  /* boardPieces[5][5] = '1X';
      boardPieces[5][6] = '1X';
      boardPieces[5][7] = '10';
      boardPieces[5][8] = '10'; */
}

function placePiece(row, col, dir, ship) {
  if (!Object.prototype.hasOwnProperty.call(ships, ship)) {
    console.log('Wrong ship');
    return;
  }

  switch (dir.toUpperCase()) {
    case 'N': {
      break;
    }
    case 'S': {
      break;
    }
    case 'W': {
      break;
    }
    case 'E': {
      break;
    }
    default: {
      console.log('Wrong direction');
    }
  }
}

/**
 * Checks whether the shot was a hit, a miss, or whether the ship sank and
 * handles it accordingly.
 *
 * @param {string} input - Indicates whether the shot was a hit (HIT), a miss
 * (MISS), or whether the ship sank (SUNK)
 */
function hitOrMiss(input) {
  switch (input.toUpperCase()) {
    case 'HIT': {
      hit();
      break;
    }
    case 'MISS': {
      miss();
      break;
    }
    case 'SUNK': {
      sunk();
      break;
    }
    default: {
      console.log('Error wrong input');
    }
  }
}

/**
 * Handles a ship hit.
 */
function hit() {
  if (state == null) {
    // A new ship is hit
    state = {
      ...neutralState,
      firstShotRow: shotRow,
      firstShotCol: shotCol,
      lastShotRow: shotRow,
      lastShotCol: shotCol
    };
  } else {
    // The known ship is hit
    state.lastShotRow = shotRow;
    state.lastShotCol = shotCol;
    updatePossShotDirHit();
    addImplicitShots();
  }
}

/**
 * Handles a miss.
 */
function miss() {
  if (state != null) {
    // A ship is hit but the shot misses
    addImplicitShots();
    updatePossShotDirMiss();
  } else {
    // Nothing
  }
}

/**
 * Handles the sinking of a ship.
 */
function sunk() {
  addFirstLastImplicitShots(state.firstShotRow, state.firstShotCol);
  addFirstLastImplicitShots(state.lastShotRow, state.lastShotCol);
  enemyShipsSunk += 1;
  state = null;

  checkWin();
}

/**
 * Removes directions where the ship cannot lie.
 */
function updatePossShotDirHit() {
  // The first shot (N) or second shot (S) after the first hit is a hit
  if (
    Object.keys(state.possDirections).length === 4 ||
    Object.keys(state.possDirections).length === 3
  ) {
    delete state.possDirections.W;
    delete state.possDirections.E;
  }
}

/**
 * Removes directions where the ship cannot lie.
 */
function updatePossShotDirMiss() {
  switch (Object.keys(state.possDirections).length) {
    case 4: {
      // The first shot (N) after the first his is a miss
      delete state.possDirections.N;
      break;
    }
    case 3: {
      // The second shot (S) after the first hit is a miss
      delete state.possDirections.S;
      break;
    }
    case 2: {
      // The shot in direction (W) is a miss
      delete state.possDirections.W;
      break;
    }
    default: {
      console.log('Error. The ship must have already sunk!');
    }
  }
}

/**
 * Adds the shots to both sides of the shot implied by a hit
 */
function addImplicitShots() {
  // The shot was in the direction N or S
  if ('N' in state.possDirections || 'S' in state.possDirections) {
    if (state.lastShotCol + directions.W > 0) {
      boardShots[state.lastShotRow][state.lastShotCol + directions.W] = `${
        boardShots[state.lastShotRow][state.lastShotCol + directions.W][0]
      }X`;
    }
    if (state.lastShotCol + directions.E < boardSize) {
      boardShots[state.lastShotRow][state.lastShotCol + directions.E] = `${
        boardShots[state.lastShotRow][state.lastShotCol + directions.E][0]
      }X`;
    }
  } else {
    // The shot was in the direction W or E
    if (state.lastShotRow + directions.N > 0) {
      boardShots[state.lastShotRow + directions.N][state.lastShotCol] = `${
        boardShots[state.lastShotRow + directions.N][state.lastShotCol][0]
      }X`;
    }
    if (state.lastShotRow + directions.S < boardSize) {
    boardShots[state.lastShotRow + directions.S][state.lastShotCol] = `${
      boardShots[state.lastShotRow + directions.S][state.lastShotCol][0]
    }X`;
  }
  }
}

/**
 * Adds the implied shots around the first and the last hit of the ship.
 * 
 * Fields that are updated by this method are marked with M instad of X.
 * 00|0M|0M|0M|00
 * 00|0M|1X|0M|00 <-- first hit
 * 00|0M|1M|0M|00
 * 00|0X|1X|0X|00
 * 00|0M|1M|0M|00
 * 00|0M|1X|0M|00 <-- last hit
 * 00|0M|0M|0M|00
 * 
 * Call this method with the location of the first hit and the last hit of the ship.
 */
function addFirstLastImplicitShots(rowPos, colPos) {
  for(let row = -1; row < 2; row++) {
    for(let col = -1; col < 2; col++) {
      const newRowPos = rowPos + row;
      const newColPos = colPos + col;
      if(newRowPos > 0 && newRowPos < boardSize && newColPos > 0 && newColPos < boardSize ) {
        boardShots[newRowPos][newColPos] = `${boardShots[newRowPos][newColPos][0]}X`
      }
    }
  }
}

function checkWin() {
  if(enemyShipsSunk >= shipsCount) {
    console.log('Du hast verloren, ich habe alle deine Schiffe versenkt!');
  }
}

function printBoard(board) {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      process.stdout.write(`${board[row][col]} `);
    }
    console.log();
  }
}
