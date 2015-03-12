self.addEventListener('message', function(e) {
	//[n, callback, testConflict, initToCheck]
	console.log(e.data);
	var task = JSON.parse(e.data); // task = [n, callback, testConflict, initToCheck, groupIndex]
	//console.log(window.nPiecesSolution(task[0],task[1],task[2],task[3])); // Nonfunctional! No window!
});