var board = {
    init: function() {
        this.clear()
        this.movements = 0
        this.score = 0
        $(".elemento").draggable()

    },
    fill: function() {
        var self = this
        $(".panel-tablero").toggle("clip", 200, function() {
            for (var i = 1; i <= 7; i++) {
                var colHTML = ""
                for (var j = 1; j <= 7; j++) {
                    var ind = Math.floor(Math.random() * 4) + 1;
                    colHTML += "<div class=\"place\" id=\"pos" + j + "-" + i + "\"> <img src=\"image/" + ind + ".png\" class=\"elemento\"/></div>"
                }
                $(".col-" + i).html(colHTML)
            }
            self.firstTimeClear()
            self.setProps()
            $(".panel-tablero").toggle("clip", 200)
        })
    },
    setProps: function() {
        self = this
        $(".elemento").draggable({ revert: true })
        $('.place').droppable({
            drop: function(event, ui) {
                var From = self.getXY(ui.draggable.parent().attr("id"))
                var To = self.getXY($(this).attr("id"))
                var rowDiff = Math.abs(From[0] - To[0])
                var colDiff = Math.abs(From[1] - To[1])
                if (rowDiff <= 1 && colDiff <= 1) { // Only the nearest
                    if ((rowDiff == 1 || colDiff == 1) && !(rowDiff == 1 && colDiff == 1)) { //XOR for diagonals
                        ui.draggable.parent().append($(this).children());
                        $(this).append(ui.draggable);
                        ui.draggable.css({
                            left: '',
                            top: ''
                        });
                        self.movements++;
                        self.score += 100;
                        var current = self.analyzeCurrent()
                        if (current.length != 0) {
                            for (i = 0; i < current.length; i++) {
                                $("#pos" + current[i]).html("<img src=\"image/1.png\" class=\"elemento\"/>")
                            }
                            self.setProps()
                        }
                    }
                }
                $("#movimientos-text").html(self.movements)
                $("#score-text").html(self.score)
            }
        });
    },
    firstTimeClear: function() {
        self = this
        var current = self.analyzeCurrent()
        if (current.length != 0) {
            for (i = 0; i < current.length; i++) {
                var ind = Math.floor(Math.random() * 4) + 1;
                $("#pos" + current[i]).html("<img src=\"image/" + ind + ".png\" class=\"elemento\"/>")
            }
            self.firstTimeClear()
        } else {
            return
        }
    },
    analyzeCurrent: function() {
        self = this
        var positions2Change = []
        for (var i = 1; i <= 7; i++) {
            var first = 0
            var count = 1
            var lines = []
            for (var j = 1; j <= 7; j++) {
                var current = self.getImgKind($("#pos" + i + "-" + j).html());
                if (current == first) {
                    lines.push(i + "-" + j)
                    count++
                } else {
                    first = current
                    if (count >= 3) {
                        positions2Change.push(lines)
                    }
                    count = 1
                    lines = [i + "-" + j]
                }
            }
            if (count >= 3) {
                positions2Change.push(lines)
            }
        }
        positions2Change = positions2Change.flat()

        for (var i = 1; i <= 7; i++) {
            var first = 0
            var count = 1
            var columns = []
            for (var j = 1; j <= 7; j++) {
                var current = self.getImgKind($("#pos" + j + "-" + i).html());
                if (current == first) {
                    if (!positions2Change.includes(j + "-" + i)) {
                        columns.push(j + "-" + i)
                    }
                    count++
                } else {
                    first = current
                    if (count >= 3) {
                        positions2Change.push(columns)
                    }
                    count = 1
                    columns = [j + "-" + i]
                }
            }
            if (count >= 3) {
                positions2Change.push(columns)
            }
        }
        return positions2Change.flat()
    },
    clear: function() {
        $(".panel-tablero").toggle("clip", 200, function() {
            for (var i = 1; i <= 7; i++) {
                $(".col-" + i).html("")
            }
            $(".panel-tablero").toggle("clip", 200)
        })
    },
    erase: function() {
        for (var i = 1; i <= 7; i++) {
            $(".col-" + i).html("")
        }
    },
    getXY: function(ID) {
        var XY = ID.split("pos")[1].split("-")
        return [parseFloat(XY[0]), parseFloat(XY[1])]
    },
    getImgKind: function(elemento) {
        return parseFloat(elemento.split('\\').pop().split('/').pop().split('.')[0])
    },
    resetScore: function() {
        self = this
        this.movements = 0
        this.score = 0
        $("#movimientos-text").html(self.movements)
        $("#score-text").html(self.score)
    }
}