
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
