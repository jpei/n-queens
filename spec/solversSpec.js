describe('solvers', function() {
  window.displayBoard = function() {};
  var maxN = 10;
  afterEach(function() {
    delete window.totalSolution; // These deletions are not critical, rather they make their corresponding test values easier to retrieve
    delete window.numOutstandingTasks;
    delete window.allOutstandingTasks;
  });

  describe('findNRooksSolution()', function() {

    it('finds a valid solution for n of 0-' + maxN, function() {
      _.range(0, maxN+1).map(function(n) {
        var solutionBoard = new Board(findNRooksSolution(n));
        var numPieces = _.reduce(solutionBoard.rows(), function(memo, row) {
          return memo + _.reduce(row, function(memo, col) {
            return memo + col;
          }, 0);
        }, 0);

        expect(solutionBoard.get('n')).to.equal(n);
        expect(numPieces).to.equal(n);
        expect(solutionBoard.hasAnyRooksConflicts()).to.be.equal(false);
      });
    });
  });

  describe('countNRooksSolutions()', function() {
    before(function(done) {
      this.timeout(20000);
      var count = 0;
      var doneOnce = function() {
        count++;
        if (count === maxN + 1)
          done();
      }
      for (var i=0; i <= maxN; i++) {
        countNRooksSolutions(i, doneOnce);
      }
    });
    it('finds the number of valid solutions for n of 0-'+maxN, function() {
      _.range(0, maxN+1).map(function(n) {
        var solutionCount = window.totalSolution[n];
        var expectedSolutionCount = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800][n];

        expect(solutionCount).to.be.equal(expectedSolutionCount);
      });
    });
  });

  describe('findNQueensSolution()', function() {

    it('finds a valid solution for n of 0-'+maxN, function() {
      // Skip 2 and 3 because they have no solution.
      [0, 1].concat(_.range(4,maxN+1)).map(function(n) {
        var solutionBoard = new Board(findNQueensSolution(n));
        var numPieces = _.reduce(solutionBoard.rows(), function(memo, row) {
          return memo + _.reduce(row, function(memo, col) {
            return memo + col;
          }, 0);
        }, 0);

        expect(solutionBoard.get('n')).to.equal(n);
        expect(numPieces).to.equal(n);
        expect(solutionBoard.hasAnyQueensConflicts()).to.be.equal(false);
      });

      // Check 2 and 3 for no solution
      [2, 3].map(function (n) {
        var solutionBoard = new Board(findNQueensSolution(n));
        var numPieces = _.reduce(solutionBoard.rows(), function(memo, row) {
          return memo + _.reduce(row, function(memo, col) {
            return memo + col;
          }, 0);
        }, 0);

        expect(numPieces).to.equal(0);
        expect(solutionBoard.get('n')).to.equal(n);
      });
    });
  });

  describe('countNQueensSolutions()', function() {

    before(function(done) {
      this.timeout(20000);
      var count = 0;
      var doneOnce = function() {
        count++;
        if (count === maxN + 1)
          done();
      }
      for (var i=0; i <= maxN; i++) {
        countNQueensSolutions(i, doneOnce);
      }
    });

    it('finds the number of valid solutions for n of 0-'+maxN, function() {
      _.range(0, maxN+1).map(function(n) {
        var solutionCount = window.totalSolution[n];
        var expectedSolutionCount = [1, 1, 0, 0, 2, 10, 4, 40, 92, 352, 724, 2680, 14200, 73712, 365596][n];

        expect(solutionCount).to.be.equal(expectedSolutionCount);
      });
    });
  });
});
