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
const shipsCount = Object.keys(ships).reduce(
  (acc, ship) => acc + ships[ship].count,
  0
);

const directions = {
  N: -1,
  S: 1,
  W: -1,
  E: 1
};

const neutralState = {
  possDirections: { ...directions },
  firstShotRow: 0,
  firstShotCol: 0
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

/* function placePiece(row, col, dir, ship) {
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
} */

/**
 * Shoots at a random field if no ship is hit. Otherwise, it shoots at the ship
 */
function shoot() {
  let row = genShootCord();
  let col = genShootCord();
  if (state === null) {
    // No ship is hit
    while (boardShots[row][col][1] === 'X') {
      // Field has already yet been shot at
      row = genShootCord();
      col = genShootCord();
    }
  } else {
    // A ship is hit
    const shotDir = Object.keys(state.possDirections)[0];

    console.log(boardShots[shotRow][shotCol][0]);
    if (boardShots[shotRow][shotCol][0] !== '0') {
      // The previous shot was a hit
      console.log('The previous shot was a hit');
      if (shotDir === 'N' || shotDir === 'S') {
        row = shotRow + state.possDirections[shotDir];
        col = shotCol;
      } else {
        row = shotRow;
        col = shotCol + state.possDirections[shotDir];
      }
    }

    if (boardShots[shotRow][shotCol][0] === '0') {
      // The previous shot was a miss
      console.log('The previous shot was a miss');
      if (shotDir === 'N' || shotDir === 'S') {
        row = state.firstShotRow + state.possDirections[shotDir];
        col = shotCol;
      } else {
        row = shotRow;
        col = state.firstShotCol + state.possDirections[shotDir];
      }
    }
  }

  if(row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
    console.log('Error. The ship should already be sunk!');
    process.exit(-1); 
  }

  shotRow = row;
  shotCol = col;
  boardShots[row][col] = `${boardShots[row][col][0]}X`;
  console.log(`Schießen auf Row: ${row}, Col: ${col}`);
}

/**
 * @returns random number from 0 to boardSize - 1
 */
function genShootCord() {
  return Math.floor(Math.random() * boardSize);
}

/**
 * Handles the result of a shot (hit, miss, sunk).
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
  boardShots[shotRow][shotCol] = '1X';
  if (state === null) {
    // A new ship is hit
    state = {
      ...neutralState,
      firstShotRow: shotRow,
      firstShotCol: shotCol
    };
  } else {
    // The known ship is hit
    addImplicitShots();
    updatePossShotDirHit();
  }
  ensureShotDirBounds();
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
  boardShots[shotRow][shotCol] = '1X';
  addFirstLastImplicitShots(state.firstShotRow, state.firstShotCol);
  addFirstLastImplicitShots(shotRow, shotCol);
  enemyShipsSunk += 1;
  state = null;

  checkWin();
}

/**
 * Removes directions where the ship cannot lie.
 */
function updatePossShotDirHit() {
  const direction = Object.keys(state.possDirections)[0];

  // The first shot (N) or second shot (S) after the first hit is a hit
  // therefore the ship cannot lie horizontally
  if (direction === 'N' || direction === 'S') {
    delete state.possDirections.W;
    delete state.possDirections.E;
  }
}

/**
 * Ensure that the next shot will be in bound
 */
function ensureShotDirBounds() {
  if (shotRow === 0) {
    delete state.possDirections.N;
  }
  if (shotRow === 9) {
    delete state.possDirections.S;
  }
  if (shotCol === 0) {
    delete state.possDirections.W;
  }
  if (shotCol === 9) {
    delete state.possDirections.E;
  }
}

/**
 * Removes directions where the ship cannot lie.
 */
function updatePossShotDirMiss() {
  const direction = Object.keys(state.possDirections)[0];
  delete state.possDirections[direction];
}

/**
 * Adds the shots to both sides of the shot implied by a hit
 */
function addImplicitShots() {
  if ('N' in state.possDirections || 'S' in state.possDirections) {
    // The shot was in the direction N or S
    if (shotCol + directions.W >= 0) {
      boardShots[shotRow][shotCol + directions.W] = `${
        boardShots[shotRow][shotCol + directions.W][0]
      }X`;
    }
    if (shotCol + directions.E < boardSize) {
      boardShots[shotRow][shotCol + directions.E] = `${
        boardShots[shotRow][shotCol + directions.E][0]
      }X`;
    }
  } else {
    // The shot was in the direction W or E
    if (shotRow + directions.N >= 0) {
      boardShots[shotRow + directions.N][shotCol] = `${
        boardShots[shotRow + directions.N][shotCol][0]
      }X`;
    }
    if (shotRow + directions.S < boardSize) {
      boardShots[shotRow + directions.S][shotCol] = `${
        boardShots[shotRow + directions.S][shotCol][0]
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
  for (let row = -1; row < 2; row++) {
    for (let col = -1; col < 2; col++) {
      const newRowPos = rowPos + row;
      const newColPos = colPos + col;
      if (
        newRowPos > 0 &&
        newRowPos < boardSize &&
        newColPos > 0 &&
        newColPos < boardSize
      ) {
        boardShots[newRowPos][
          newColPos
        ] = `${boardShots[newRowPos][newColPos][0]}X`;
      }
    }
  }
}

function checkWin() {
  if (enemyShipsSunk >= shipsCount) {
    console.log('Du hast verloren, alle deine Schiffe wurden versenkt!');
  }
}

// eslint-disable-next-line no-unused-vars
function printBoard(board) {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      process.stdout.write(`${board[row][col]} `);
    }
    console.log();
  }
  console.log();
}
