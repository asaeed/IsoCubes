
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