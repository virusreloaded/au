var cursorPosition = [ 1, 0 ];
var dataToProcess = [];

console.log("http://webgldeveloper.pro");

var twoD = [
  [ -934,-870, -792],
  [ 63, 77, 87],
  [ {r: 0, g: 178, b: 133 }, {r: 255, g: 115, b: 115 }, {r: 239, g: 142, b: 78 }]
];
var values = [
  [ "Bicycles", 58092, 110375 ],
  [ "Bicycles", 191546, 363937 ],
  [ "Bicycles", 325000, 617500 ],
  [ "Bicycles", 458454, 871063 ]
];

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
            if ( cursorPosition[0] > 0 ) { cursorPosition[0] -= 1 };
        break;

        case 38: // up
            if ( cursorPosition[1] > 0 ) { cursorPosition[1] -= 1 };
        break;

        case 39: // right
            if ( cursorPosition[0] < 2 ) { cursorPosition[0] += 1 };
        break;

        case 40: // down
            if ( cursorPosition[1] < 3 ) { cursorPosition[1] += 1 };
        break;

        default: return; // exit this handler for other keys
    }
    dataToProcess = [ twoD[0][ cursorPosition[0] ], twoD[1][ cursorPosition[0] ], twoD[2][ cursorPosition[0] ], values[ cursorPosition[1] ][ cursorPosition[0] ] ];
    valueToProcess = [ values[ cursorPosition[1] ][ cursorPosition[0] ], cursorPosition[0], twoD[2][ cursorPosition[0] ] ];

    if (ctrlFlag == true) { controls.enabled = false }
    drawCursor(dataToProcess);
    updateInfo(valueToProcess);
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$("#start").click(function() {
    $('#canvasContainer').removeClass('blur');
    $('#start').fadeOut('300');
    moveCam();
});
$(".unlock").click(function() {
    lineMaterial.opacity = 0;
    $('.info').removeClass('shown');
    $('.prod').removeClass('shown');
    $('.tip').css('right','-400px');
    $('.tip2').css('top','80%');
    moveCamBack();
});