var board = {
    init: function() {
        this.clear()
        $(".elemento").draggable()

    },
    fill: function() {
        $(".panel-tablero").toggle("clip", 200, function() {
            for (var i = 1; i <= 7; i++) {
                var colHTML = ""
                for (var j = 1; j <= 7; j++) {
                    var ind = Math.floor(Math.random() * 4) + 1;
                    colHTML += "<div class=\"place\" id=\"pos" + j + "-" + i + "\"> <img src=\"image/" + ind + ".png\" class=\"elemento\"/></div>"
                }
                $(".col-" + i).html(colHTML)
            }
            $(".elemento").draggable({ revert: true })
            $('.place').droppable({
                drop: function(event, ui) {
                    var From = getXY(ui.draggable.parent().attr("id"))
                    var To = getXY($(this).attr("id"))
                    var rowDiff = Math.abs(From[0] - To[0]) == 1
                    var colDiff = Math.abs(From[1] - To[1]) == 1
                    if ((rowDiff || colDiff) && !(rowDiff && colDiff)) { //XOR
                        ui.draggable.parent().append($(this).children());
                        $(this).append(ui.draggable);
                        ui.draggable.css({
                            left: '',
                            top: ''
                        });
                    }
                }
            });
            $(".panel-tablero").toggle("clip", 200)
        })
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
    }
}

function getImgKind(elemento) {
    return parseFloat(elemento.split('\\').pop().split('/').pop().split('.')[0])
}

function getXY(ID) {
    var XY = ID.split("pos")[1].split("-")
    return [parseFloat(XY[0]), parseFloat(XY[1])]
}

function printCurrent() {
    for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 7; j++) {
            console.log("(" + i + "-" + j + "): " + getImgKind($("#pos" + i + "-" + j).html()))
        }
    }
}