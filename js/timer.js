var timer = {
    start: function(mins) {
        var initialDate = new Date();

        var countDownDate = new Date(initialDate);
        countDownDate.setMinutes(initialDate.getMinutes() + 2);

        var x = setInterval(function() {
            var now = new Date().getTime();
            var distance = countDownDate.getTime() - now;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("timer").innerHTML = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("timer").innerHTML = "EXPIRED";
            }
        }, 1000);
    }
}