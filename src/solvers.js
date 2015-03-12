/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

window.nPiecesSolutionsLead = function(n, callback, testConflict) {
  var numCores = navigator.hardwareConcurrency || 4;
  if (window[callback]()[0] || numCores === 1 || !window.Worker)
    return nPiecesSolutions(n, callback, testConflict);
  var myWorkers = [];
  window.totalSolution = window.totalSolution || [];
  window.totalSolution.push(0);
  window.numOutstandingTasks = window.numOutstandingTasks || [];
  window.numOutstandingTasks.push(0);
  window.allOutstandingTasks = window.allOutstandingTasks || [];
  var groupIndex = window.totalSolution.length;

  for (var i=Math.floor((n-1)/2); i>=0; i--) {
    window.allOutstandingTasks.push([n, callback, testConflict, i, groupIndex]);
  }

  for (var i=0; i<numCores-1; i++) { // Ideally each core assigned to a worker except first to main
    if (window.allOutstandingTasks.length && !myWorkers[i]) {
      myWorkers[i] = new Worker('src/solverWorker.js');
      var task = window.allOutstandingTasks.shift();
      myWorkers[i].postMessage(JSON.stringify(task));
      window.numOutstandingTasks[task[4]]--;
    }
  }
};

window.nPiecesSolutions = function(n, callback, testConflict, init) {
  var solution = undefined;
  var earlyTerminate = false;
  var board = new Board({'n':n});
  var numPieces = 0;
  if (init) {
    board.grid[init][0] = 1;
    numPieces++;
  }

  var nPiecesRecurse = function(checkRow, checkCol) {
    if (arguments.length > 0 && window[testConflict](board, checkRow, checkCol)) // No column conflicts by construction
      return;
    else {
      if (numPieces === n) {
        var reply = window[callback](board, solution, n);
        earlyTerminate = reply[0];
        solution = reply[1];
      } else {
        for (var i=0; i<n; i++) {
          if (numPieces === 0 && i >= n/2) // Uses left-right symmetry to approximately halve the calculations
            continue;
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

window.findCallback = function(board, solution, n) {
  return [true, board];
}
window.countCallback = function(board, solution, n) {
  if (board === undefined)
    return [false, undefined];
  var incrementBy = 2 - (n === 0 ? 1 : (n % 2 == 1 ? board.grid[(n-1)/2][0] : 0));
  return [false, solution ? solution + incrementBy : incrementBy];
}
window.testRookConflict = function(board, checkRow, checkCol) {
  return board.hasRowConflictAt(checkRow);
}
window.testQueenConflict = function(board, checkRow, checkCol) {
  return board.hasRowConflictAt(checkRow) || board.hasMajorDiagonalConflictAt(checkCol - checkRow) || board.hasMinorDiagonalConflictAt(checkCol + checkRow);
}

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  var solution = nPiecesSolutionsLead(n, "findCallback", "testRookConflict");
  var matrixForm = [];
  for (var i=0; i<n; i++) {
    matrixForm.push(solution.grid[i]);
  }
  return matrixForm;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solution = nPiecesSolutionsLead(n, "countCallback", "testRookConflict");
  return typeof solution === "number" ? solution : 0;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = nPiecesSolutionsLead(n, "findCallback", "testQueenConflict");
  var matrixForm = [];
  for (var i=0; i<n; i++) {
    matrixForm.push(solution.grid[i]);
  }
  return matrixForm;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solution = nPiecesSolutionsLead(n, "countCallback", "testQueenConflict");
  return typeof solution === "number" ? solution : 0;
};
