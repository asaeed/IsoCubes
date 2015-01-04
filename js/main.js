
// imports
//var CustomShape = require('./customShape');
var BlockController = require('./blockController');
//var Gui = require('./gui');

// private variables
var iso = new Isomer(document.getElementById("canvas"));

// runs once
function init() {
    //Gui.setup();
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
        $("#viewport").attr("content", "width=device-width, initial-scale=1, user-scalable=no");
    } else {
        $("#viewport").attr("content", "user-scalable=no");
    }

    // if on mobile version, cut canvas rez by half
    if (window.innerWidth < 600) {
        $('#canvas').attr('width', '500');
        $('#canvas').attr('height', '1000');
    } else {
        $('#canvas').attr('width', '1500');
        $('#canvas').attr('height', '3000');
    }
}

$(window).scroll(function(e) {
    var scrollTop = $(this).scrollTop();
    var docHeight = $(document).height();
    var winHeight = $(window).height();
    var scrollPercent = (scrollTop) / (docHeight - winHeight);
    var scrollPercentRounded = Math.round(scrollPercent*100);

    console.log(scrollTop);
    //Gui.params.scrollTop = scrollTop;
    //Gui.params.scrollPercent = scrollPercentRounded;

});

window.onbeforeunload = function() {
    window.scrollTo(0, 0);
};

/* attempts to hide address bars on android chrome and ios - both have removed scrollTo() for hiding */
/*
window.onload = function() {
    
    setTimeout(function() { 
        console.log('scrolling');
        window.scrollTo(0, 1);
        //launchIntoFullscreen(document.documentElement);
        console.log($(window).scrollTop());
    }, 1000);
};

// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
*/

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
    $('.years-subtitle').velocity("transition.fadeIn", { delay: 8000 });
    $('.panel-bottom').velocity("transition.fadeIn", { delay: 8000 });

    // $('.confetti').velocity("transition.fadeIn", { duration: 1000, delay: 1000 });
    // $('.panel-top').velocity("transition.fadeIn", { delay: 1000 });
    // $('.years-subtitle').velocity("transition.fadeIn", { delay: 1000 });
    // $('.panel-bottom').velocity("transition.fadeIn", { delay: 1000 });
    
});
