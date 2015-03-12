

self.addEventListener('message', function(e) {
  importScripts('../lib/underscore.js');
  importScripts('../lib/backbone.js');
  importScripts('Board.js');

	var task = JSON.parse(e.data); // task = [n, callback, testConflict, initToCheck, groupIndex, workerIndex]
	postMessage(JSON.stringify([nPiecesSolutions(task[0],task[1],task[2],task[3]), task[4], task[5]]));
});

var nPiecesSolutions = function(n, callback, testConflict, init) {
  var solution = undefined;
  var earlyTerminate = false;
  var board = new Board({'n':n});
  var numPieces = 0;
  if (init !== undefined) {
    board.grid[init][0] = 1;
    numPieces++;
  }

  var nPiecesRecurse = function(checkRow, checkCol) {
    if (arguments.length > 0 && self[testConflict](board, checkRow, checkCol)) // No column conflicts by construction
      return;
    else {
      if (numPieces === n) {
        var reply = self[callback](board, solution, n);
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

var findCallback = function(board, solution, n) {
  return [true, board];
}
var countCallback = function(board, solution, n) {
  if (board === undefined)
    return [false, undefined];
  var incrementBy = 2 - (n === 0 ? 1 : (n % 2 == 1 ? board.grid[(n-1)/2][0] : 0));
  return [false, solution ? solution + incrementBy : incrementBy];
}
var testRookConflict = function(board, checkRow, checkCol) {
  return board.hasRowConflictAt(checkRow);
}
var testQueenConflict = function(board, checkRow, checkCol) {
  return board.hasRowConflictAt(checkRow) || board.hasMajorDiagonalConflictAt(checkCol - checkRow) || board.hasMinorDiagonalConflictAt(checkCol + checkRow);
}