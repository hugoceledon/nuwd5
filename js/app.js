// Configuration Variables
var minutes = 5
var correctMoveScore = 50
var wrongMoveScore = 20

// Objects declaration

var Timer = timer // Timer object
Timer.init(minutes * 60) // Begin timer object

var Board = board // Board object
Board.init(correctMoveScore, wrongMoveScore) // Begin board object

// Main function
$(function() {
    setInterval(function() {
        if (Timer.clockOver) {
            Board.startAnimation();
            Timer.clockOver = false;
            Board.endGame = true;
        }
    }, 50)
})