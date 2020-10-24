/*!
 * Board Game Object
 * HUGO JOSÉ CELEDÓN FLÓREZ
 * Next University
 *
 * Date: 2020-10-10T10:00
 */

// Board Object Declaration
var boardGame = {
    init: function(correctMoveScore, wrongMoveScore, timerMinutes) {
        // Board initialization.

        // Score configuration
        this.correctMoveScore = correctMoveScore
        this.wrongMoveScore = wrongMoveScore

        // Timer configuration
        this.Timer = timer // Timer object
        this.Timer.init(timerMinutes * 60) // Begin timer object

        // Initialization
        this.clear()
        this.movements = 0
        this.score = 0
        $(".elemento").draggable()
        this.initResetBtn()
        this.blinkTitle(".main-titulo")
        this.blinkTitle(".game-over")
        this.bigScore = false; // Boolean to know if score is set to full screen
        this.endGame = false; // Boolean to know if game has ended or not

    },
    start: function() {
        // Method to start the board.
        self = this
        setInterval(function() {
            if (self.Timer.clockOver) {
                self.stop();
            }
        }, 50)
    },
    stop: function() {
        // Timer reached actions for the board.
        console.log("Timer Reached!")
        this.startAnimation()
        this.endGame = true;
        self.Timer.clockOver = false;
    },
    initResetBtn: function() {
        // Set properties for reset button.
        var self = this
        $(".btn-reinicio").mouseup(function() {
            if (!self.endGame) {
                if (!self.Timer.running) {
                    $(this).html("reiniciar")
                    self.fill()
                    self.Timer.start()
                    console.log("Started Game!")
                } else {
                    self.Timer.reset()
                    self.clear()
                    self.resetScore()
                    $("#timer").css('color', '#E8CA06').css('font-size', '1.4em');
                    $(this).html("iniciar")
                    console.log("Reseted Timer!")
                }
            } else {
                $("#timer").css('color', '#E8CA06').css('font-size', '1.4em');
                self.eraseColumns()
                self.endGame = false;
                self.startAnimation();
                $(this).html("iniciar")
                self.Timer.restart()
                self.resetScore()
                console.log("Back to main event!")
            }
        })
    },
    fill: function() {
        // Fills board with random elements.
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
    getColumnsDict: function(current) {
        // Format current elements to a columns dictionary.
        var dict = new Object();
        for (var i = 0; i < current.length; i++) {
            var res = current[i].split("-");
            if (res[1] in dict) {
                dict[res[1]].push(current[i])
            } else {
                dict[res[1]] = [current[i]]
            }
        }
        return dict
    },
    setProps: function() {
        // Set drag and drop properties to all element objects.
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
                            Draggable.effect('pulsate', {}, 700)
                            self.removeMatches(current)
                        } else {
                            self.score -= self.wrongMoveScore;
                            // Wrong move animation
                            Draggable.effect('shake', {}, 500);
                            Droppable.effect('shake', {}, 500);

                            setTimeout(function(Destination, Source, Draggable, Droppable) {
                                Destination.append(Draggable);
                                Source.append(Droppable);
                                Draggable.css({
                                    left: '',
                                    top: ''
                                });
                            }, 500, Destination, Source, Draggable, Droppable)
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
        // Remove matches at first random fill of the board.
        self = this
        var current = self.analyzeCurrent()
        if (current.length != 0) {
            for (var i = 0; i < current.length; i++) {
                var ind = Math.floor(Math.random() * 4) + 1;
                $("#pos" + current[i]).html("<img src=\"image/" + ind + ".png\" class=\"elemento\"/>")
            }
            self.firstTimeClear()
        } else {
            return
        }
    },
    analyzeCurrent: function() {
        // Returns current matches to be changed.
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
        // Toggles the pannel and erases columns.
        self = this
        $(".panel-tablero").toggle("clip", 200, function() {
            self.eraseColumns()
            $(".panel-tablero").toggle("clip", 200)
        })
    },
    eraseColumns: function() {
        // Erase all columns in the board.
        for (var i = 1; i <= 7; i++) {
            $(".col-" + i).html("")
        }
    },
    getXY: function(ID) {
        // Get coordenates for given ID.
        var XY = ID.split("pos")[1].split("-")
        return [parseFloat(XY[0]), parseFloat(XY[1])]
    },
    getImgKind: function(element) {
        // Returns the image kind of an element.
        return parseFloat(element.split('\\').pop().split('/').pop().split('.')[0])
    },
    resetScore: function() {
        // Reset score and movements to zero.
        this.movements = 0
        this.score = 0
        $("#movimientos-text").html(this.movements)
        $("#score-text").html(this.score)
    },
    startAnimation: function() {
        // Animation to set score full-screen or go back to default.
        self = this
        if (self.bigScore) {
            // If score is full screen.
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
            // Change to fullscreen score.
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
        // Change color to white and 1000 milliseconds to yellow.
        self = this
        $(title).animate({
            color: "#FFF"
        }, 1000, function() {
            self.yellowTitle(title)
        });
    },
    yellowTitle: function(title) {
        // Change color to yellow and 600 milliseconds back to white.
        self = this
        $(title).animate({
            color: "#DCFF0E"
        }, 600, function() {
            self.blinkTitle(title)
        });
    },
    removeMatches: function(current) {
        // Remove element matches.
        if (current.length > 0) {
            self = this
            self.score += self.correctMoveScore * current.length;

            for (var i = 0; i <= current.length; i++) {
                var element = $("#pos" + current[i]).children();

                // Animate the disappearance of elemnts
                element.animate({
                    opacity: 0
                }, 100, function() {
                    $(this).animate({
                        opacity: 1.0
                    }, 60, function() {
                        $(this).effect('explode', {}, 400, function() {
                            $(this).animate({
                                opacity: 0
                            }, 1)
                        })
                    })
                })

            }
            // Recursive function to delete all matches
            setTimeout(function(current) {
                var dict = self.getColumnsDict(current);
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        var columnLength = dict[key].length
                        var removePositions = []
                        for (var i = 0; i < columnLength; i++) {
                            removePositions.push(parseInt(dict[key][i].replace("-" + key, "")))
                        }
                        removePositions.sort(function(a, b) { return a - b; });
                        removePositions = [...new Set(removePositions)];
                        var keepPositions = Array.from(Array(7), (v, i) => i + 1).filter(function(value) { return !removePositions.includes(value) });

                        for (var k = 7; k >= 1; k--) {
                            if (keepPositions.length > 0) {
                                var value = k;
                                if (!keepPositions.includes(k)) {
                                    value = Math.max(...keepPositions);
                                    self.moveElement(key, value, k)
                                }
                                keepPositions.splice(keepPositions.indexOf(value), 1);
                            } else {
                                self.createElement(key, k)
                            }
                        }
                    }
                }
                self.removeMatches(self.analyzeCurrent())
            }, 300, current)

        }
        self.setProps()
    },
    moveElement: function(column, origin, destiny) {
        // Moves an existing element on a column from origin row to destiny row
        var Origin = $("#pos" + origin + "-" + column)
        var Destiny = $("#pos" + destiny + "-" + column)
        var oChild = Origin.children()
        var dChild = Destiny.children()

        Destiny.append(oChild)
        Origin.append(dChild)
        oChild.css("top", "-=" + (99 * destiny))
        oChild.animate({ opacity: 1.0, top: "0" }, 300)
    },
    createElement: function(column, destiny) {
        // Creates a new random element on a column on destiny row
        var ind = Math.floor(Math.random() * 4) + 1;
        var Destiny = $("#pos" + destiny + "-" + column)
        Destiny.html("<img src=\"image/" + ind + ".png\" class=\"elemento\" style=\"opacity:0;\"/>").children()
        var dChild = Destiny.children()
        dChild.css("top", "-=" + (99 * (7 - destiny)))
        dChild.animate({}, 650, function() {
            $(this).animate({ top: "0", opacity: 1.0 }, 650)
        })
    }
}