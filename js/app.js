var Secs = 10 // Timer seconds

var Timer = timer // Timer object
Timer.init(Secs) // Begin timer object

var Board = board // Board object
Board.init() // Begin board object

var bigScore = false; // Boolean to know if score is set to full screen
var endGame = false; // Boolean to know if game has ended or not

function startAnimation() { // Animation to set score full-screen or go back to default
    if (bigScore) {
        bigScore = false;
        $(".game-over").toggle("clip", 200)
        $(".panel-tablero").toggle("slide", 1, function() {
            $(this).animate({
                width: "70%"
            }, 999)
        })
        $(".panel-score").animate({
            width: "25%"
        }, 1000, function() {
            $(".time").toggle("clip", 500, function() {
                $(".moves").toggle("clip", 250, function() {
                    $(".moves").toggle("clip", 250, function() {
                        $(".score").toggle("clip", 250, function() {
                            $(".score").toggle("clip", 250)
                        })
                    })
                })
            })
        })
    } else {
        bigScore = true;
        $(".panel-tablero").animate({
            width: "0%"
        }, 999, function() {
            $(this).toggle("slide", 1)
        });
        $(".panel-score").animate({
            width: "100%"
        }, 1000, function() {
            $(".game-over").toggle()
            $(".time").toggle("clip", 500)
        })

    }
}

$(function() {

    function blinkTitle(title) {
        $(title).animate({
            color: "#FFF"
        }, 1000, function() {
            yellowTitle(title)
        });
    }

    function yellowTitle(title) {
        $(title).animate({
            color: "#DCFF0E"
        }, 600, function() {
            blinkTitle(title)
        });
    }

    blinkTitle(".main-titulo")
    blinkTitle(".game-over")

    setInterval(function() {
        if (Timer.clockOver) {
            startAnimation();
            Timer.clockOver = false;
            endGame = true;
        }
    }, 50)

    $(".btn-reinicio").mouseup(function() {
        if (!endGame) {
            if (!Timer.running) {
                $(this).html("Reiniciar")
                Board.fill()
                Timer.start()
            } else {
                Timer.reset()
                Board.clear()
                $(this).html("Iniciar")
            }
        } else {
            $("#timer").css('color', '#E8CA06').css('font-size', '1.4em');
            Board.erase()
            endGame = false;
            startAnimation();
            $(this).html("Iniciar")
            Timer.init(Secs)
        }
    })
})