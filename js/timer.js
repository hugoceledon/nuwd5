/*!
 * Timer Object
 * HUGO JOSÉ CELEDÓN FLÓREZ
 * Next University
 *
 * Date: 2020-10-10T10:00
 */

var timer = {
    init: function(secs) {
        // Timer initialization.

        this.secs = secs;
        $("#timer").css('font-size', '1.4em');
        this.running = false;
        this.clockOver = false;
        $("#timer").html(new Date(this.secs * 1000).toISOString().substr(14, 5))
    },
    start: function() {
        // Method to start the timer.
        this.clockOver = false;
        this.running = true;
        var initialDate = new Date();
        initialDate.setSeconds(initialDate.getSeconds() + 1)

        var countDownDate = new Date(initialDate);
        countDownDate.setSeconds(initialDate.getSeconds() + this.secs);

        var self = this

        this.x = setInterval(function() {
            var now = new Date().getTime();
            var distance = countDownDate.getTime() - now;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            $("#timer").html(("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2))
            if (distance < 6000) {
                $("#timer").css('color', '#FFD4CC').css('font-size', '2.0em');
            }
            if (distance < 1000) {
                self.stop();
                self.running = false;
                self.clockOver = true;
            }
        }, 50);
    },
    stop: function() {
        // Method to stop timer.
        clearInterval(this.x);
    },
    reset: function() {
        // Method to stop and restart timer object.
        this.stop()
        this.restart()
    },
    restart: function() {
        // Method to restart timer object.
        this.init(this.secs)
    }
}