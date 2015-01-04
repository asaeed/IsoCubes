
var BlockGridController = require('./blockGridController');
var selector = require('./blockSelector');
var animator = require('./blockAnimator');

// private variables
var iso = new Isomer(document.getElementById("canvas"));
var Color = Isomer.Color;

var transparency = 0.5;
var colors = {};
// studios colors
//colors.orange = new Color(247, 145, 29, transparency);
//colors.blue = new Color(0, 172, 221, transparency);
//colors.green = new Color(121, 192, 66, transparency);
// altered colors
colors.orange = new Color(255, 136, 39, transparency);
colors.blue = new Color(7, 185, 226, transparency);
colors.green = new Color(121, 209, 70, transparency);

var blockSize = 1;
var blockGrids = {};
blockGrids.orange = new BlockGridController(colors.orange, blockSize);
blockGrids.green = new BlockGridController(colors.green, blockSize);
blockGrids.blue = new BlockGridController(colors.blue, blockSize);

exports.setup = function() {
	blockGrids.orange.setup();
	blockGrids.orange.offset = { x: -blockSize, y: 0, z: 0 };
	blockGrids.orange.extendDirection = 'x';
	
	blockGrids.green.setup();
	blockGrids.green.offset = { x: 0, y: -blockSize, z: 0 };
	blockGrids.green.extendDirection = 'y';

	blockGrids.blue.setup();
	blockGrids.blue.offset = { x: 0, y: 0, z: blockSize };
	blockGrids.blue.extendDirection = 'z';
};

exports.draw = function() {
	blockGrids.orange.draw();
	blockGrids.blue.draw();
	blockGrids.green.draw();
	
};

exports.goToState = function(stateNum) {

	switch(stateNum) {
		case 0:
			//console.log('blocks entering state 0');
			break;
		case 1:
			//console.log('blocks entering state 1');
			// selector.forSomeInvisibleBlocks.call(blockGrids.orange, 0.6, animator.appearFromTransparent);
			// selector.forSomeInvisibleBlocks.call(blockGrids.blue, 0.6, animator.appearFromTransparent);
			// selector.forSomeInvisibleBlocks.call(blockGrids.green, 0.6, animator.appearFromTransparent);
			selector.forInvisibleBlocks.call(blockGrids.orange, animator.appearFromTransparent);
			selector.forInvisibleBlocks.call(blockGrids.blue, animator.appearFromTransparent);
			selector.forInvisibleBlocks.call(blockGrids.green, animator.appearFromTransparent);
			break;
		case 2:
			//console.log('blocks entering state 3');
			selector.forAllBlocks.call(blockGrids.orange, animator.grow);
			selector.forAllBlocks.call(blockGrids.blue, animator.grow);
			selector.forAllBlocks.call(blockGrids.green, animator.grow);
			setTimeout(function() { exports.goToState.call(this, 3); }, 3500);
			break;
		case 3:
			//console.log('blocks entering state 4');
			selector.forAllBlocks.call(blockGrids.orange, animator.reset);
			selector.forAllBlocks.call(blockGrids.blue, animator.reset);
			selector.forAllBlocks.call(blockGrids.green, animator.reset);
			setTimeout(function() { exports.goToState.call(this, 2); }, 10000);
			break;
		default:
			//console.log('blocks unknown state');
	}
	

	// old way, before selector and animator separated out
	//blockGrids.orange.forSomeRandomBlocks.call(blockGrids.orange, 0.4, blockGrids.orange.appearFromBelow);
};