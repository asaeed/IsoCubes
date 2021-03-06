
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
    this.origin = new Point(0, 0, -1);

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
            if (x+y < 2) continue;  // cut off bottom
            if (x+y >= 32) continue;  // cut off top
            if (x+this.gridSizeY-y <= 10) continue;  // cut off left
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