$(window).load(function() {

    // function that makes the original circle around the container it's in.
    function makeCircle(items) {
        // by creative-punch.net

        for (var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            items[i].style.marginLeft = -(items[i].offsetWidth / 2) + "px";

            items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
        }
    }

    // function that returns an array with the position of the items, in the original order
    function getPositions($items) {
        var positions = [];

        for (var i = 0; i < $items.length; i++) {
            var pos = $items.eq(i).position();
            var posObj = {
                position: pos
            }
            positions.push(posObj);
        }

        // will be a list of objects, in order, with positions
        return positions;
    }

    // function that returns the distance between point A and point B (they should be
    // a set of X and Y coordinates)
    function computeDistance(pointA, pointB) {
        var x = pointA.left - pointB.left;
        var y = pointA.top - pointB.top;

        return Math.sqrt((x * x) + (y * y));
    }

    // getting canvas and links
    var $spiderWeb = $("#spiderweb-wrapper");
    var $spiderLinks = $("#spiderweb-wrapper a");

    // making circle
    makeCircle($spiderLinks);

    // to use in mousemove function
    var spiderTop = $spiderWeb.offset().top;
    var spiderLeft = $spiderWeb.offset().left;

    // getting original positions
    var originalPositions = getPositions($spiderLinks);

    $spiderWeb.mousemove(function(event) {
        // event is the mouse pointer
        var x = event.pageX;
        var y = event.pageY;

        var relX = x - spiderLeft;
        var relY = y - spiderTop;

        var scaleFactor = 0.16;

        for (var i = 0; i < $spiderLinks.length; i++) {

            var $spiderLink = $spiderLinks.eq(i);
            // getting x and y relative to container
            var origX = originalPositions[i].position.left;
            var origY = originalPositions[i].position.top;

            var itemPos = {
                top: origY,
                left: origX
            }

            var mousePos = {
                top: relY,
                left: relX
            }

            // getting inverse ratio of distance to size of container (the closest item will have the lowest scale factor).
            // the 500 is taken from the container size, and we are multiplying by the original scale factor in order to have
            // a small, workable value.
            var relScale = scaleFactor * (computeDistance(itemPos, mousePos) / 500);
            console.log(scaleFactor);

            var scaleRelX = (relX - origX) * relScale;
            var scaleRelY = (relY - origY) * relScale;

            var newX = origX + scaleRelX;
            var newY = origY + scaleRelY;

            TweenMax.to($spiderLink, 0.2, {
                top: newY,
                left: newX
            });
        }

    }).mouseout(function() {
        for (var i = 0; i < $spiderLinks.length; i++) {
            var $spLink = $spiderLinks.eq(i);
            TweenMax.to($spLink, 0.5, {
                top: originalPositions[i].position.top,
                left: originalPositions[i].position.left
            });
        }
    });
});
