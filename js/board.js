var board = {
    init: function(CMS, WMS) {
        this.clear()
        this.movements = 0
        this.score = 0
        $(".elemento").draggable()
        this.correctMoveScore = CMS
        this.wrongMoveScore = WMS
        this.initResetBtn()
        this.blinkTitle(".main-titulo")
        this.blinkTitle(".game-over")
        this.bigScore = false; // Boolean to know if score is set to full screen
        this.endGame = false; // Boolean to know if game has ended or not
    },
    initResetBtn: function() {
        var self = this
        $(".btn-reinicio").mouseup(function() {
            if (!self.endGame) {
                if (!Timer.running) {
                    $(this).html("Reiniciar")
                    Board.fill()
                    Timer.start()
                    console.log("Started Game!")
                } else {
                    Timer.reset()
                    Board.clear()
                    Board.resetScore()
                    $("#timer").css('color', '#E8CA06').css('font-size', '1.4em');
                    $(this).html("Iniciar")
                    console.log("Reset the Timer!")
                }
            } else {
                $("#timer").css('color', '#E8CA06').css('font-size', '1.4em');
                Board.erase()
                self.endGame = false;
                Board.startAnimation();
                $(this).html("Iniciar")
                Timer.init(Secs)
                Board.resetScore()
                console.log("Back to main event!")
            }
        })
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
    add: function(dict) {
        var self = this
        for (var i in dict) {
            if (dict.hasOwnProperty(i)) {
                // var colHTML = $(".col-" + i).html()
                // for (var j = 9; j <= 8 + dict[i].length; j++) {
                //     var ind = Math.floor(Math.random() * 4) + 1;
                //     colHTML += "<div class=\"place\" id=\"pos" + dict[i][j] + "\"> <img src=\"image/" + ind + ".png\" class=\"elemento\"/></div>"
                // }
                // $(".col-" + i).html(colHTML)
            }
        }
    },
    getColumnsDict: function(current) {
        var dict = new Object();
        for (i = 0; i < current.length; i++) {
            var res = current[i].split("-");
            if (res[1] in dict) {
                dict[res[1]].push(current[i])
            } else {
                dict[res[1]] = [current[i]]
            }
        }
        return dict
    },
    blink: function(current) {
        for (i = 0; i < current.length; i++) {
            $("#pos" + current[i]).animate({
                opacity: 1.0,
                visibility: "visible"
            }, 100, function() {
                $(this).animate({
                    opacity: 0
                }, 100, function() {
                    $(this).animate({
                        opacity: 1.0
                    }, 100, function() {
                        $(this).animate({
                            opacity: 0
                        }, 100)
                    })
                })
            })
        }
    },
    removeElements: function(current) {
        self = this
        self.score += self.correctMoveScore * current.length;

        self.blink(current)

        var dict = self.getColumnsDict(current)
            // REMOVE INVISIBLE ELEMENTS
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                console.log(key, dict[key]);
                var columnLength = dict[key].length
                for (i = 0; i < columnLength; i++) {
                    var position = parseInt(dict[key][i].replace("-" + key, ""))
                    console.log(position.toString() + " to " + (position - columnLength).toString())
                        // $("#pos" + current[i]).html("<img src=\"image/2.png\" class=\"elemento\"/>")
                }
            }
        }

        self.add(dict)
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

                        var Destination = ui.draggable.parent()
                        var Source = $(this)
                        var Draggable = ui.draggable
                        var Droppable = $(this).children()

                        Destination.append(Droppable);
                        Source.append(Draggable);
                        Draggable.css({
                            left: '',
                            top: ''
                        });

                        self.movements++;
                        var current = self.analyzeCurrent()
                        if (current.length != 0) {
                            var current = self.analyzeCurrent()
                            self.removeElements(current)
                        } else {
                            self.score -= self.wrongMoveScore;
                            Draggable.animate({
                                left: "+=10"
                            }, 50, function() {
                                $(this).animate({
                                    left: "-=10"
                                }, 50, function() {
                                    $(this).animate({
                                        left: "+=10"
                                    }, 50, function() {
                                        $(this).animate({
                                            left: "0"
                                        }, 50)
                                    })
                                })
                            })
                            Destination.append(Draggable);
                            Source.append(Droppable);
                            Draggable.css({
                                left: '',
                                top: ''
                            });
                        }
                        self.setProps()
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
    },
    startAnimation: function() { // Animation to set score full-screen or go back to default
        self = this
        if (self.bigScore) {
            self.bigScore = false;
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
            self.bigScore = true;
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
    },
    blinkTitle: function(title) {
        self = this
        $(title).animate({
            color: "#FFF"
        }, 1000, function() {
            self.yellowTitle(title)
        });
    },
    yellowTitle: function(title) {
        self = this
        $(title).animate({
            color: "#DCFF0E"
        }, 600, function() {
            self.blinkTitle(title)
        });
    }
}