
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