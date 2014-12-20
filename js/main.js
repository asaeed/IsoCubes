
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
