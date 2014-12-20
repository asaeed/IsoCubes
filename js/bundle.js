(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
},{"./blockGridController":2}],2:[function(require,module,exports){

// dependencies
var iso = new Isomer(document.getElementById("canvas"));
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

function BlockGridController(color) {
	// defaults
	console.log(color);
	if (typeof color === 'undefined')
		color = new Color(99, 102, 106);

	// private vars
	this.color = color;
	this.blocks = [];
	this.blockSize = 1;
	this.gridSizeX = 12;
	this.gridSizeY = 12;
	this.spaceApart = this.blockSize * 3;
	this.origin = new Point(-6, -6, 0);

	this.blockTemplate = Shape.Prism(this.origin, this.blockSize, this.blockSize, this.blockSize);
}

// public vars
BlockGridController.prototype.transparency = 0.5;
BlockGridController.prototype.visible = true;
BlockGridController.prototype.offset = { x: 0, y: 0, z: 0 };
BlockGridController.prototype.extendDirection = 'x';

// public functions
BlockGridController.prototype.setup = function () {
	// setup buildings 2d array
    for (var x = 0; x < this.gridSizeX; x++) {
        this.blocks[x] = [];
        for (var y = 0; y < this.gridSizeY; y++) {
            this.blocks[x][y] = {};
            
            this.blocks[x][y].size = {};
            this.blocks[x][y].size.x = 1;
            this.blocks[x][y].size.y = 1;
            this.blocks[x][y].size.z = 1;

            this.blocks[x][y].pos = {};
            this.blocks[x][y].pos.x = x * this.spaceApart;
            this.blocks[x][y].pos.y = y * this.spaceApart;
            this.blocks[x][y].pos.z = 0;
        }
    }
};

BlockGridController.prototype.draw = function() {
	if (this.visible === false) return;
    // have to draw backwards to maintain relative depth
    for (var x = this.gridSizeX - 1; x >= 0; x--) {
        for (var y = this.gridSizeY - 1; y >= 0; y--) {
            var size = this.blocks[x][y].size;
            var pos = this.blocks[x][y].pos;
            var off = this.offset;
            var b = this.blockTemplate.translate(pos.x + off.x, pos.y + off.y, pos.z + off.z)
                .scale(this.origin, size.x, size.y, size.z);

            iso.add(b, this.color);
            //iso.add(b);
        }
    }
};

BlockGridController.prototype.appear = function(color) {
    // first make them flat
    for (var a = 0; a < this.gridSizeX; a++) {
        for (var b = 0; b < this.gridSizeY; b++) {
            var t1 = new TWEEN.Tween(this.blocks[a][b].size)
                .to({ y: 0 }, 10)
                .start();
        }
    }

    this.visible = true;

    // now appear and grow to size 1
    for (var x = 0; x < this.gridSizeX; x++) {
        for (var y = 0; y < this.gridSizeY; y++) {
            var t2 = new TWEEN.Tween(this.blocks[x][y].size)
                .to({ y: 1 }, 1500)
                .easing(TWEEN.Easing.Quadratic.In)
                .delay(x/this.gridSizeX * 500)
                .start();
        }
    }

    //setTimeout(this.reset, 3000);
};

BlockGridController.prototype.grow = function() {
    var maxHeight = 8;

    for (var x = 0; x < this.gridSizeX; x++) {
        for (var y = 0; y < this.gridSizeY; y++) {

        	// to get something of the form:
        	// { y: Math.random() * maxHeight }
        	var targetSize = {};
        	targetSize[this.extendDirection] = Math.random() * maxHeight;

            var t = new TWEEN.Tween(this.blocks[x][y].size)
                .to(targetSize, 3000)
                .easing(TWEEN.Easing.Cubic.Out)
                .delay(x/this.gridSizeX * 500)
                .start();
        }
    }

    setTimeout(this.reset.bind(this), 3500);
};

BlockGridController.prototype.reset = function() {
    for (var x = 0; x < this.gridSizeX; x++) {
        for (var y = 0; y < this.gridSizeY; y++) {

        	var targetSize = {};
        	targetSize[this.extendDirection] = 1;

            var t = new TWEEN.Tween(this.blocks[x][y].size)
                .to(targetSize, 6000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .delay(x/this.gridSizeX * 2000)
                .start();
        }
    }

    setTimeout(this.grow.bind(this), 10000);
};

module.exports = BlockGridController;
},{}],3:[function(require,module,exports){

var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

exports.Stairs = function (origin) {
  var STEP_COUNT = 10;

  /* Create a zig-zag */
  var zigzag = new Path(origin);
  var steps = [], i;

  /* Shape to return */
  var stairs = new Shape();

  for (i = 0; i < STEP_COUNT; i++) {
    /**
     *  2
     * __
     *   | 1
     */

    var stepCorner = origin.translate(0, i / STEP_COUNT, (i + 1) / STEP_COUNT);
    /* Draw two planes */
    steps.push(new Path([
      stepCorner,
      stepCorner.translate(0, 0, -1 / STEP_COUNT),
      stepCorner.translate(1, 0, -1 / STEP_COUNT),
      stepCorner.translate(1, 0, 0)
    ]));

    steps.push(new Path([
      stepCorner,
      stepCorner.translate(1, 0, 0),
      stepCorner.translate(1, 1 / STEP_COUNT, 0),
      stepCorner.translate(0, 1 / STEP_COUNT, 0)
    ]));

    zigzag.push(stepCorner);
    zigzag.push(stepCorner.translate(0, 1 / STEP_COUNT, 0));
  }

  zigzag.push(origin.translate(0, 1, 0));


  for (i = 0; i < steps.length; i++) {
    stairs.push(steps[i]);
  }
  stairs.push(zigzag);
  stairs.push(zigzag.reverse().translate(1, 0, 0));

  return stairs;
};

exports.Knot = function (origin) {
  var knot = new Shape();

  knot.paths = knot.paths.concat(Shape.Prism(Point.ORIGIN, 5, 1, 1).paths);
  knot.paths = knot.paths.concat(Shape.Prism(new Point(4, 1, 0), 1, 4, 1).paths);
  knot.paths = knot.paths.concat(Shape.Prism(new Point(4, 4, -2), 1, 1, 3).paths);

  knot.push(new Path([
    new Point(0, 0, 2),
    new Point(0, 0, 1),
    new Point(1, 0, 1),
    new Point(1, 0, 2)
  ]));

  knot.push(new Path([
    new Point(0, 0, 2),
    new Point(0, 1, 2),
    new Point(0, 1, 1),
    new Point(0, 0, 1)
  ]));

  return knot.scale(Point.ORIGIN, 1/5).translate(-0.1, 0.15, 0.4).translate(origin.x, origin.y, origin.z);
};
},{}],4:[function(require,module,exports){

// controlled params
var guiParams = function() {

    this.canvasColor = "#333333";
    this.backColor = "#333333";
    this.scrollTop = 0;
    this.scrollPercent = 0;

    //this.message = 'dat.gui';
    //this.speed = 0.8;
    //this.displayOutline = false;
    //this.explode = function() { 
    //};

};

exports.params = new guiParams();

exports.setup = function() {
    var gui = new dat.GUI();

    gui.addColor(exports.params, 'canvasColor').onChange(function(value) {
        $('#canvas').css('background-color', value);
    });

    gui.addColor(exports.params, 'backColor').onChange(function(value) {
        $('body').css('background-color', value);
    });

    gui.add(exports.params, 'scrollTop').listen();
    gui.add(exports.params, 'scrollPercent', 0, 100).listen();

    //gui.add(exports.params, 'message');
    //gui.add(exports.params, 'speed', -5, 5);
    //gui.add(exports.params, 'displayOutline');
    //gui.add(exports.params, 'explode');
};
},{}],5:[function(require,module,exports){

// imports
var CustomShape = require('./customShape');
var BlockController = require('./blockController');
var Gui = require('./gui');

// private variables
var iso = new Isomer(document.getElementById("canvas"));

// runs once
function init() {
    Gui.setup();
    BlockController.setup();
}

function animate(time) {
    window.requestAnimationFrame(animate);
    TWEEN.update(time);
    iso.canvas.clear();

    // draw
    BlockController.draw();
}

$(window).scroll(function(e){
    var scrollTop = $(this).scrollTop();
    var docHeight = $(document).height();
    var winHeight = $(window).height();
    var scrollPercent = (scrollTop) / (docHeight - winHeight);
    var scrollPercentRounded = Math.round(scrollPercent*100);

    console.log(scrollTop);
    Gui.params.scrollTop = scrollTop;
    Gui.params.scrollPercent = scrollPercentRounded;

});

window.onbeforeunload = function(){
    window.scrollTo(0,0);
};

// lets go
(function () {
    init();
    animate();
})();

},{"./blockController":1,"./customShape":3,"./gui":4}]},{},[5]);
