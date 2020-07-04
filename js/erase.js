$(".container").droppable({
    accept: function(d) {
        console.log(d.attr("id"))
        var resD = d.attr("id").replace("pos", "").split("-");
        var rowD = resD[0]
        var colD = resD[1]
        console.log("dropped: " + rowD + "-" + colD + " in: " + "rowC" + "-" + "colC")
        return false
    },
})

$(".elemento").draggable(options)
$(".place").droppable({
    drop: function(event, ui) {
        src.append(
            $('.elemento', this).remove().clone()
            .removeClass().addClass("elemento")
            .draggable(options)
        );

        $(this).append(
            ui.draggable.remove().clone()
            .removeClass().addClass("elemento")
            .draggable(options)
        );
    }
})


if ((rowDiff || colDiff) && !(rowDiff && colDiff)) { //XOR
    var Draggable = ui.draggable.remove()
    if (rowDiff) {
        if ((From[0] - To[0]) > 0) {
            $(this).children().animate({
                top: "+=99"
            }, 500, function() {
                $(this).animate({
                    top: "0"
                }, 1)
            })
        } else {
            $(this).children().animate({
                top: "-=99"
            }, 500, function() {
                $(this).animate({
                    top: "0"
                }, 1)
            })
        }
    } else {
        if ((From[1] - To[1]) > 0) {
            $(this).children().animate({
                right: "-=99"
            }, 500, function() {
                $(this).animate({
                    right: "0"
                }, 1)
            })
        } else {
            $(this).children().animate({
                right: "+=99"
            }, 500, function() {
                $(this).animate({
                    right: "0"
                }, 1)
            })
        }
    }
    setTimeout(function(Parent, Div, ui) {
        Parent.append(Div.children());
        Div.append(Draggable.remove().clone().addClass("elemento").draggable({ revert: true }));
        ui.draggable.css({
            left: '',
            top: ''
        });
    }, 500, Parent, $(this), ui, Draggable)
}
}