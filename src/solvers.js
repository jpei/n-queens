/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = undefined;
  var board = new Board({'n':n});
  var numRooks = 0;
  var findNRooksRecurse = function(checkRow) {
    if (checkRow !== undefined && board.hasRowConflictAt(checkRow)) // No column conflicts by construction
      return;
    else {
      if (numRooks === n) {
        //console.log('Single solution for ' + n + ' rooks:', JSON.stringify(board));
        solution = board;
      } else {
        for (var i=0; i<n; i++) {
          board.grid[i][numRooks] = 1;
          numRooks++;
          findNRooksRecurse(i);
          if (solution)
            return;
          numRooks--;
          board.grid[i][numRooks] = 0;
        }
      }
    }
  }
  findNRooksRecurse();
  solution = solution || board;
  var matrixForm = [];
  for (var i=0; i<n; i++) {
    matrixForm.push(solution.grid[i]);
  }
  return matrixForm;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({'n':n});
  var numRooks = 0;
  var countNRooksRecurse = function(checkRow) {
    if (checkRow !== undefined && board.hasRowConflictAt(checkRow)) // No column conflicts by construction
      return;
    else {
      if (numRooks === n) {
        solutionCount++;
      } else {
        for (var i=0; i<n; i++) {
          board.grid[i][numRooks] = 1;
          numRooks++;
          countNRooksRecurse(i);
          numRooks--;
          board.grid[i][numRooks] = 0;
        }
      }
    }
  }
  countNRooksRecurse();
  //console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined;
  var board = new Board({'n':n});
  var numQueens = 0;
  var findNQueensRecurse = function(checkRow, checkCol) {
    if (arguments.length > 0 && (board.hasRowConflictAt(checkRow) || board.hasMajorDiagonalConflictAt(checkCol - checkRow) || board.hasMinorDiagonalConflictAt(checkCol + checkRow))) // No column conflicts by construction
      return;
    else {
      if (numQueens === n) {
        //console.log('Single solution for ' + n + ' queens:', JSON.stringify(board));
        solution = board;
      } else {
        for (var i=0; i<n; i++) {
          board.grid[i][numQueens] = 1;
          numQueens++;
          findNQueensRecurse(i, numQueens-1);
          if (solution)
            return;
          numQueens--;
          board.grid[i][numQueens] = 0;
        }
      }
    }
  }
  findNQueensRecurse();
  solution = solution || board;
  var matrixForm = [];
  for (var i=0; i<n; i++) {
    matrixForm.push(solution.grid[i]);
  }
  return matrixForm;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({'n':n});
  var numQueens = 0;
  var findNQueensRecurse = function(checkRow, checkCol) {
    if (arguments.length > 0 && (board.hasRowConflictAt(checkRow) || board.hasMajorDiagonalConflictAt(checkCol - checkRow) || board.hasMinorDiagonalConflictAt(checkCol + checkRow))) // No column conflicts by construction
      return;
    else {
      if (numQueens === n) {
        solutionCount++;
      } else {
        for (var i=0; i<n; i++) {
          board.grid[i][numQueens] = 1;
          numQueens++;
          findNQueensRecurse(i, numQueens-1);
          numQueens--;
          board.grid[i][numQueens] = 0;
        }
      }
    }
  }
  findNQueensRecurse();
  //console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
