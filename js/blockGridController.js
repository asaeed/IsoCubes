
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