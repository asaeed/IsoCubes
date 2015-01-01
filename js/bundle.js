(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// various animations to perform on blocks
// this was separated out from blockGridController
// caller should pass appropriate scope to these functions using .call(scope, params...)

exports.appearFromFlat = function(block, x, y) {
    // first make them flat
    block.size.z = 0.01;

    block.visible = true;

    // now appear and grow to size 1
    var t2 = new TWEEN.Tween(block.size)
        .to({ z: 1 }, 1000)
        .easing(TWEEN.Easing.Quadratic.In)
        .delay(x/this.gridSizeX * 1000)
        .start();
};

exports.appearFromBelow = function(block, x, y) {
    var distanceBelow = 60;

    // first position them below
    block.pos.x += -distanceBelow;
    block.pos.y += -distanceBelow;

    block.visible = true;

    // now appear by shooting up in a staggered manner
    var t2 = new TWEEN.Tween(block.pos)
        .to({ x: block.pos.x + distanceBelow, y: block.pos.y + distanceBelow }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .delay((x/this.gridSizeX + y/this.gridSizeY) * -1000 + 1200)
        .start();
};

exports.appearFromTransparent = function(block, x, y) {
    // first make invisible
    block.color.a = 0.01;

    block.visible = true;

    // now fade in in a random pattern
    var t2 = new TWEEN.Tween(block.color)
        .to({ a: 0.5 }, 400)
        .easing(TWEEN.Easing.Quadratic.Out)
        .delay(Math.random() * 4500)
        .start();
};

exports.grow = function(block, x, y) {
    var maxHeight = 8;

    // construct variable targetSize = { z: newHeight }
    var targetSize = {};
    targetSize[this.extendDirection] = Math.random() * maxHeight;

    var t = new TWEEN.Tween(block.size)
        .to(targetSize, 2000)
        .easing(TWEEN.Easing.Cubic.Out)
        .delay(x/this.gridSizeX * 500)
        .start();
};

exports.reset = function(block, x, y) {
    var targetSize = {};
    targetSize[this.extendDirection] = 1;

    var t = new TWEEN.Tween(block.size)
        .to(targetSize, 6000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .delay(x/this.gridSizeX * 2000)
        .start();
};
},{}],2:[function(require,module,exports){

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
			console.log('blocks entering state 0');
			break;
		case 1:
			console.log('blocks entering state 1');
			// selector.forSomeInvisibleBlocks.call(blockGrids.orange, 0.6, animator.appearFromTransparent);
			// selector.forSomeInvisibleBlocks.call(blockGrids.blue, 0.6, animator.appearFromTransparent);
			// selector.forSomeInvisibleBlocks.call(blockGrids.green, 0.6, animator.appearFromTransparent);
			selector.forInvisibleBlocks.call(blockGrids.orange, animator.appearFromTransparent);
			selector.forInvisibleBlocks.call(blockGrids.blue, animator.appearFromTransparent);
			selector.forInvisibleBlocks.call(blockGrids.green, animator.appearFromTransparent);
			break;
		case 2:
			console.log('blocks entering state 3');
			selector.forAllBlocks.call(blockGrids.orange, animator.grow);
			selector.forAllBlocks.call(blockGrids.blue, animator.grow);
			selector.forAllBlocks.call(blockGrids.green, animator.grow);
			setTimeout(function() { exports.goToState.call(this, 3); }, 3500);
			break;
		case 3:
			console.log('blocks entering state 4');
			selector.forAllBlocks.call(blockGrids.orange, animator.reset);
			selector.forAllBlocks.call(blockGrids.blue, animator.reset);
			selector.forAllBlocks.call(blockGrids.green, animator.reset);
			setTimeout(function() { exports.goToState.call(this, 2); }, 10000);
			break;
		default:
			console.log('blocks unknown state');
	}
	

	// old way, before selector and animator separated out
	//blockGrids.orange.forSomeRandomBlocks.call(blockGrids.orange, 0.4, blockGrids.orange.appearFromBelow);
};
},{"./blockAnimator":1,"./blockGridController":3,"./blockSelector":4}],3:[function(require,module,exports){

// dependencies
var iso = new Isomer(document.getElementById("canvas"));
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

function BlockGridController(color, blockSize) {
    // defaults
    if (typeof color === 'undefined')
        color = new Color(99, 102, 106);

    // private vars
    this.color = color;
    this.blockSize = blockSize;
    this.blocks = [];
    this.gridSizeX = 16;
    this.gridSizeY = 16;
    this.spaceApart = blockSize * 3;
    this.origin = new Point(0, 0, -6);

    this.blockTemplate = Shape.Prism(this.origin, blockSize, blockSize, blockSize);
}

// public vars
BlockGridController.prototype.visible = true;
BlockGridController.prototype.offset = { x: 0, y: 0, z: 0 };
BlockGridController.prototype.extendDirection = 'x';

// public functions
BlockGridController.prototype.setup = function () {
    // setup buildings 2d array
    for (var x = 0; x < this.gridSizeX; x++) {
        this.blocks[x] = [];
        for (var y = 0; y < this.gridSizeY; y++) {

            // optimization - remove blocks that are offscreen
            if (x+y < 4) continue;  // cut off bottom
            if (x+y >= 28) continue;  // cut off top
            if (x+this.gridSizeY-y <= 12) continue;  // cut off left
            if (x+this.gridSizeY-y > 20) continue;  // cut off right

            this.blocks[x][y] = {};
            this.blocks[x][y].visible = false;

            this.blocks[x][y].color = new Color(this.color.r, this.color.g, this.color.b, this.color.a);
            
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

            if (typeof this.blocks[x][y] === 'undefined' || !this.blocks[x][y].visible) continue;

            var size = this.blocks[x][y].size;
            var pos = this.blocks[x][y].pos;
            var off = this.offset;
            var newPos = { x: this.origin.x + pos.x + off.x, y: this.origin.y + pos.y + off.y, z: this.origin.z + pos.z + off.z };
            var b = this.blockTemplate.translate(newPos.x, newPos.y, newPos.z)
                .scale(newPos, size.x, size.y, size.z);

            var c = this.blocks[x][y].color;
            iso.add(b, c);
            //iso.add(b);
        }
    }
};

module.exports = BlockGridController;
},{}],4:[function(require,module,exports){

// various ways to select blocks
// this was separated out from blockGridController
// caller should pass appropriate scope to these functions using .call(scope, params...)
// these functions in turn pass along scope to callback

exports.forAllBlocks = function(callback) {
    for (var a = 0; a < this.gridSizeX; a++) {
        for (var b = 0; b < this.gridSizeY; b++) {
            if (typeof this.blocks[a][b] === 'undefined') continue;
            callback.call(this, this.blocks[a][b], a, b);
        }
    }
};

exports.forSomeRandomBlocks = function(prob, callback) {
    for (var a = 0; a < this.gridSizeX; a++) {
        for (var b = 0; b < this.gridSizeY; b++) {
            if (typeof this.blocks[a][b] === 'undefined') continue;
            if (Math.random() <= prob) {
                callback.call(this, this.blocks[a][b], a, b);
            }
        }
    }
};

exports.forVisibleBlocks = function(callback) {
    for (var a = 0; a < this.gridSizeX; a++) {
        for (var b = 0; b < this.gridSizeY; b++) {
            if (typeof this.blocks[a][b] === 'undefined') continue;
            if (this.blocks[a][b].visible)
                callback.call(this, this.blocks[a][b], a, b);
        }
    }
};

exports.forInvisibleBlocks = function(callback) {
    for (var a = 0; a < this.gridSizeX; a++) {
        for (var b = 0; b < this.gridSizeY; b++) {
            if (typeof this.blocks[a][b] === 'undefined') continue;
            if (!this.blocks[a][b].visible)
                callback.call(this, this.blocks[a][b], a, b);
        }
    }
};

exports.forSomeInvisibleBlocks = function(prob, callback) {
    for (var a = 0; a < this.gridSizeX; a++) {
        for (var b = 0; b < this.gridSizeY; b++) {
            if (typeof this.blocks[a][b] === 'undefined') continue;
            if (!this.blocks[a][b].visible && Math.random() <= prob)
                callback.call(this, this.blocks[a][b], a, b);
        }
    }
};
},{}],5:[function(require,module,exports){

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
    dat.GUI.toggleHide();

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
},{}],6:[function(require,module,exports){

// imports
//var CustomShape = require('./customShape');
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
    requestAnimationFrame(animate);
    TWEEN.update(time);
    iso.canvas.clear();

    // draw
    BlockController.draw();
}

$(window).resize(onResize);
function onResize() {
    // remove viewport if in landscape on mobile, or else background anim is obscured
    if (screen.width < screen.height) {
        $("#viewport").attr("content", "width=device-width, initial-scale=1, user-scalable=no, minimal-ui");
    } else {
        $("#viewport").attr("content", "user-scalable=no, minimal-ui");
    }
}

$(window).scroll(function(e) {
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
    window.scrollTo(0, 0);
};

// main
(function () {
    onResize();

    // setup canvas
    init();
    animate();

    // setup full-panel, smaller panel behind it
    $('.begin-arrow').velocity({ 'top': '12px' }, { loop: true });

    // go to initial block states
    BlockController.goToState(0);
})();

$('.full-panel').click(function() {
    // slide up full-panel
    $('.full-panel').velocity({ 'top': '-150%' }, {
        duration: 1000,
        easing: "easeInQuart",
    });

    // slowly fade in years text
    $('.years-text span').velocity("transition.fadeIn", { delay: 1500, stagger: 360 });

    // at the same time, begin populating hex tiles
    setTimeout( function() { BlockController.goToState(1); }, 1500);

    // finally show confetti and other content and make blocks grow
    setTimeout( function() { BlockController.goToState(2); }, 7000);
    $('.confetti').velocity("transition.fadeIn", { duration: 100, delay: 7500 });
    $('.panel-top').velocity("transition.fadeIn", { delay: 8000 });
    $('.panel-bottom').velocity("transition.fadeIn", { delay: 8000 });
    
});

},{"./blockController":2,"./gui":5}]},{},[6]);
