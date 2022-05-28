const ships = {
    battleship: {
      count: 1,
      size: 5,
    },
    cruiser: {
      count: 2,
      size: 4,
    },
    destroyer: {
      count: 3,
      size: 3,
    },
    submarine: {
      count: 4,
      size: 2,
    },
  };
  
  const directions = {
    N: -1,
    S: 1,
    W: -1,
    E: 1,
  };
  
  const neutralState = {
    possDirections: { ...directions },
    firstShotRow: 0,
    firstShotCol: 0,
    lastShotRow: 0,
    lastShotCol: 0,
  };
  
  let state = null;
  
  const boardSize = 10;
  
  const boardShots = new Array(boardSize);
  const boardPieces = new Array(boardSize);
  
  let shotRow = 0;
  let shotCol = 0;
  
  (function main() {
    initBoards();
  
    shotRow = 1;
    shotCol = 2;
    hitOrMiss("HIT");
    hit();
    console.log(JSON.stringify(state));
    printBoard(boardShots);
  })();
  
  // boardShots[shotRow][shotCol] = `${boardShots[shotRow][shotCol][0]}X`;
  
  function initBoards() {
    for (let row = 0; row < boardSize; row++) {
      boardPieces[row] = [];
      boardShots[row] = [];
  
      for (let col = 0; col < boardSize; col++) {
        boardPieces[row][col] = "00";
        boardShots[row][col] = "00";
      }
    }
  
    /* boardPieces[5][5] = '1X';
      boardPieces[5][6] = '1X';
      boardPieces[5][7] = '10';
      boardPieces[5][8] = '10'; */
  }
  
  function placePiece(row, col, dir, ship) {
    if (!ships.hasOwnProperty(ship)) {
      console.log("Wrong ship");
      return;
    }
  
    switch (dir.toUpperCase()) {
      case "N": {
        break;
      }
      case "S": {
        break;
      }
      case "W": {
        break;
      }
      case "E": {
        break;
      }
      default: {
        console.log("Wrong direction");
      }
    }
  }
  
  /**
   * Checks whether the shot was a hit, a miss, or whether the ship sank and
   * handles it accordingly.
   *
   * @param {string} input - Indicates whether the shot was a hit (HIT), a miss
   * (MISS), or whether the ship sank ('SUNK')
   */
  function hitOrMiss(input) {
    switch (input.toUpperCase()) {
      case "HIT": {
        hit();
        break;
      }
      case "MISS": {
        miss();
        break;
      }
      case "SUNK": {
        sunk();
        break;
      }
      default: {
        console.log("Error wrong input");
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
        lastShotCol: shotCol,
      };
    } else {
      // The known ship is hit
      state.lastShotRow = shotRow;
      state.lastShotCol = shotCol;
      updateShotDirHit();
      addImplicitShots();
    }
  }
  
  /**
   * Handles a miss.
   */
  function miss() {
    if (state != null) {
      // A ship is hit but the shot misses
      updateShotDirMiss();
    }
  }
  
  function sunk() {}
  
  /**
   * Removes directions where the ship cannot lie.
   */
  function updateShotDirHit() {
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
  function updateShotDirMiss() {
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
        console.log("Error. The ship must have already sunk!");
      }
    }
  }
  
  /**
   * Adds the shots implied by a hit
   */
  function addImplicitShots() {
    // The shot was in the direction N or S
    if ("N" in state.possDirections || "S" in state.possDirections) {
      boardShots[state.lastShotRow][state.lastShotCol + directions.W] = `${
        boardShots[state.lastShotRow][state.lastShotCol][0]
      }X`;
      boardShots[state.lastShotRow][state.lastShotCol + directions.E] = `${
        boardShots[state.lastShotRow][state.lastShotCol][0]
      }X`;
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
