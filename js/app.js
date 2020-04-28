var Timer = timer
var Mins = 1
Timer.init(Mins)

var bigScore = false;
var endGame = false;

function startAnimation() {
    if (bigScore) {
        bigScore = false;
        $(".game-over").toggle("clip", 500)
        $(".panel-tablero").toggle("slide", 1, function() {
            $(this).animate({
                width: "70%"
            }, 999)
        })
        $(".panel-score").animate({
            width: "25%"
        }, 1000, function() {
            $(".time").toggle("clip", 500)
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

    $(".erase").mouseup(function() {
        startAnimation()
    })

    function whiteTitle() {
        $(".main-titulo").animate({
            color: "#FFF"
        }, 1000, yellowTitle);
    }

    function yellowTitle() {
        $(".main-titulo").animate({
            color: "#DCFF0E"
        }, 600, whiteTitle);
    }

    whiteTitle()

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
                Timer.start()
            } else {
                Timer.reset()
                $(this).html("Iniciar")
            }
        } else {
            endGame = false;
            startAnimation();
            $(this).html("Iniciar")
            Timer.init(Mins)
        }
    })
})