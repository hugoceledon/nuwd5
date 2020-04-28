var timer = {
    init: function(mins) {
        this.running = false;
        this.clockOver = false;
        this.mins = mins;
        $("#timer").html(("0" + this.mins).slice(-2) + ":" + "00")
    },
    start: function() {
        this.clockOver = false;
        this.running = true;
        var initialDate = new Date();
        initialDate.setSeconds(initialDate.getSeconds() + 1)

        var countDownDate = new Date(initialDate);
        countDownDate.setMinutes(initialDate.getMinutes() + this.mins);

        var self = this

        this.x = setInterval(function() {
            var now = new Date().getTime();
            var distance = countDownDate.getTime() - now;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            $("#timer").html(("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2))
            if (distance < 1000) {
                self.stop();
                self.running = false;
                self.clockOver = true;
            }
        }, 50);
    },
    stop: function() {
        clearInterval(this.x);
    },
    reset: function() {
        this.stop()
        this.init(this.mins)
    }
}