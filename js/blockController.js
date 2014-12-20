
var BlockGridController = require('./blockGridController');

// private variables
var iso = new Isomer(document.getElementById("canvas"));
var Color = Isomer.Color;

var transparency = 0.5;
var colors = {};
colors.orange = new Color(247, 145, 29, transparency);
colors.blue = new Color(0, 172, 221, transparency);
colors.green = new Color(121, 192, 66, transparency);

var blockGrids = {};
blockGrids.orange = new BlockGridController(colors.orange);
blockGrids.green = new BlockGridController(colors.green);
blockGrids.blue = new BlockGridController(colors.blue);

exports.setup = function() {
	blockGrids.orange.setup();
	blockGrids.orange.offset = { x: -1, y: 0, z: 0 };
	blockGrids.orange.extendDirection = 'x';
	
	blockGrids.green.setup();
	blockGrids.green.offset = { x: 0, y: -1, z: 0 };
	blockGrids.green.extendDirection = 'y';

	blockGrids.blue.setup();
	blockGrids.blue.offset = { x: 0, y: 0, z: 1 };
	blockGrids.blue.extendDirection = 'z';

	exports.beginSequence();
};

exports.draw = function() {
	blockGrids.orange.draw();
	blockGrids.green.draw();
	blockGrids.blue.draw();
};

exports.beginSequence = function() {
	blockGrids.orange.grow();
	blockGrids.green.grow();
	blockGrids.blue.grow();
};