var count, all;
var trySol = function(ld, cols, rd) {
	if (cols === all)
		count++;
	else {
		var poss = ~(ld | cols | rd) & all;
		while (poss) {
			var bit = poss & -poss;
			poss -= bit;
			trySol((ld|bit)<<1, cols|bit, (rd|bit)>>1);
		}
	}
}

var start = function() {
	all = 1;
	for (var n=1; n<=12; n++) {
		count = 0;
		trySol(0,0,0);
		console.log("There are " + count + " solutions to " + n + "-queens problem");
		all = 2*all + 1;
	}
}

start();