/*!
 * Board Match Game
 * HUGO JOSÉ CELEDÓN FLÓREZ
 * Next University
 *
 * Date: 2020-10-10T10:00
 */

// Board Object Declaration
var matchGame = boardGame

matchGame.init(
    correctMoveScore = 50, // Score to be added when a correct move is made.
    wrongMoveScore = 20, // Score to be substracted when a wrong move is made.
    timerMinutes = 0.1 // Timer's end time.
)

// Main Function
$(function() {
    matchGame.start(); // Start Method
})