var Timer = timer

$(function() {
    $(".btn-reinicio").mouseup(function() {
        $(this).html("Reiniciar")
        Timer.start()
    })
})