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
  window.numOutstandingTasks.push(Math.floor((n-1)/2)+1);
  window.allOutstandingTasks = window.allOutstandingTasks || [];
  var groupIndex = window.totalSolution.length-1;

  for (var i=Math.floor((n-1)/2); i>=0; i--) {
    window.allOutstandingTasks.push([n, callback, testConflict, i, groupIndex]);
  }

  for (var i=0; i<numCores-1; i++) { // Ideally each core assigned to a worker except first to main
    if (window.allOutstandingTasks.length && !myWorkers[i]) {
      myWorkers[i] = new Worker('/src/solverWorker.js');
      var task = window.allOutstandingTasks.shift();
      task.push(i);
      // console.log(JSON.stringify(task));
      myWorkers[i].postMessage(JSON.stringify(task));
      myWorkers[i].onmessage = function(e) {
        var message = JSON.parse(e.data); //message is [solutionCount, groupIndex, workerIndex]
        (typeof message[0] === 'number') && (window.totalSolution[message[1]] += message[0]);
        window.numOutstandingTasks[message[1]]--;
        if (!window.numOutstandingTasks[message[1]]) {
          console.log(window.totalSolution[message[1]]);
        }
        if (window.allOutstandingTasks.length) {
          var task = window.allOutstandingTasks.shift();
          task.push(message[2]);
          myWorkers[message[2]].postMessage(JSON.stringify(task));
        } else {
          if (myWorkers[message[2]])
            myWorkers[message[2]].terminate();
        }
      }
    }
  }
};

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
  nPiecesSolutionsLead(n, "countCallback", "testRookConflict")
  // var solution = nPiecesSolutionsLead(n, "countCallback", "testRookConflict");
  // return typeof solution === "number" ? solution : 0;
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
  nPiecesSolutionsLead(n, "countCallback", "testQueenConflict")
  // var solution = nPiecesSolutionsLead(n, "countCallback", "testQueenConflict");
  // return typeof solution === "number" ? solution : 0;
};
