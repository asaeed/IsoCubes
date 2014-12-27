
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
        .delay(Math.random() * 4000)
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