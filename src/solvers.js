/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

window.nPiecesSolutions = function(n, callback, testConflict) {
  var solution = undefined;
  var earlyTerminate = false;
  var board = new Board({'n':n});
  var numPieces = 0;
  var nPiecesRecurse = function(checkRow, checkCol) {
    if (arguments.length > 0 && testConflict(board, checkRow, checkCol)) // No column conflicts by construction
      return;
    else {
      if (numPieces === n) {
        var reply = callback(board, solution);
        earlyTerminate = reply[0];
        solution = reply[1];
      } else {
        for (var i=0; i<n; i++) {
          board.grid[i][numPieces] = 1;
          numPieces++;
          nPiecesRecurse(i, numPieces - 1);
          if (earlyTerminate)
            return;
          numPieces--;
          board.grid[i][numPieces] = 0;
        }
      }
    }
  }
  nPiecesRecurse();
  solution = solution || board;
  return solution;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  var callback = function(board, solution) {
    return [true, board];
  }
  var testConflict = function(board, checkRow, checkCol) {
    return board.hasRowConflictAt(checkRow);
  }
  var solution = nPiecesSolutions(n, callback, testConflict);
  var matrixForm = [];
  for (var i=0; i<n; i++) {
    matrixForm.push(solution.grid[i]);
  }
  return matrixForm;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var callback = function(board, solution) {
    return [false, solution ? solution + 1 : 1];
  }
  var testConflict = function(board, checkRow, checkCol) {
    return board.hasRowConflictAt(checkRow)
  }
  var solution = nPiecesSolutions(n, callback, testConflict);
  return typeof solution === "number" ? solution : 0;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var callback = function(board, solution) {
    return [true, board];
  }
  var testConflict = function(board, checkRow, checkCol) {
    return board.hasRowConflictAt(checkRow) || board.hasMajorDiagonalConflictAt(checkCol - checkRow) || board.hasMinorDiagonalConflictAt(checkCol + checkRow);
  }
  var solution = nPiecesSolutions(n, callback, testConflict);
  var matrixForm = [];
  for (var i=0; i<n; i++) {
    matrixForm.push(solution.grid[i]);
  }
  return matrixForm;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var callback = function(board, solution) {
    return [false, solution ? solution + 1 : 1];
  }
  var testConflict = function(board, checkRow, checkCol) {
    return board.hasRowConflictAt(checkRow) || board.hasMajorDiagonalConflictAt(checkCol - checkRow) || board.hasMinorDiagonalConflictAt(checkCol + checkRow);
  }
  var solution = nPiecesSolutions(n, callback, testConflict);
  return typeof solution === "number" ? solution : 0;
};
