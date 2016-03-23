(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cell = Cell;
function Cell(initialState) {
    this.isAlive = initialState;
    this.willBeAlive = false;
}

Cell.prototype.computeNextState = function (aliveNeighborsCount) {
    if (aliveNeighborsCount == 3) {
        this.willBeAlive = true;
    } else if (aliveNeighborsCount > 3 || aliveNeighborsCount < 2) {
        this.willBeAlive = false;
    } else {
        this.willBeAlive = this.isAlive;
    }

    return this.willBeAlive;
};

Cell.prototype.nextState = function () {
    this.isAlive = this.willBeAlive;
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CellGrid = CellGrid;

var _Cell = require('./Cell');

function CellGrid(rows, columns) {
    this.cells = new Array(rows);
    var n = 0;
    for (var i = -1; ++i < rows;) {
        this.cells[i] = new Array(columns);
        for (var j = -1; ++j < columns;) {
            var cell = new _Cell.Cell(false);
            cell.n = n++;
            cell.x = i;
            cell.y = j;
            this.cells[i][j] = cell;
        }
    }
}

CellGrid.prototype.aliveNeighborsFor = function (x, y) {
    var self = this,
        neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    function isAliveAt(i, j) {
        if (i < 0 || i >= self.cells.length || j < 0 || j >= self.cells[0].length) {
            return false;
        }
        return self.cells[i][j].isAlive;
    }

    var count = 0;
    for (var i = 0; i < neighbors.length; i++) {
        count += isAliveAt(x + neighbors[i][0], y + neighbors[i][1]) ? 1 : 0;
    }

    return count;
};

CellGrid.prototype.eachCell = function (callback) {
    var rows = this.cells.length,
        columns = this.cells[0].length,
        x,
        y;
    for (var i = 0; i < rows * columns; i++) {
        x = i % rows;y = Math.floor(i / rows);
        callback.apply(this, [this.cells[x][y], x, y]);
    }
};

CellGrid.prototype.reset = function () {
    this.eachCell(function (cell, x, y) {
        cell.isAlive = Math.random() > 0.5;
    });
};

CellGrid.prototype.prepareStep = function () {
    this.eachCell(function (cell, x, y) {
        cell.computeNextState(this.aliveNeighborsFor(x, y));
    });
};

CellGrid.prototype.step = function () {
    this.prepareStep();
    this.eachCell(function (cell, x, y) {
        cell.nextState();
    });
};

CellGrid.prototype.aliveCells = function () {
    var alive = [];
    this.eachCell(function (cell) {
        cell.isAlive && alive.push(cell);
    });
    return alive;
};

},{"./Cell":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GameOfLife = GameOfLife;

var _CellGrid = require('./CellGrid');

var _Cell = require('./Cell');

function GameOfLife(selector) {

    var selector = selector;

    var square = document.querySelector(selector).offsetWidth;

    var gameFinished = false;

    var svg = d3.select(selector).append("svg:svg").attr("width", square).attr("height", square);

    var squares = svg.selectAll("square");

    var grid, wRatio, hRatio, radius;

    var setGrid = function setGrid(x, y) {
        var columns = x;
        var rows = y;

        wRatio = square / columns, hRatio = square / rows, grid = new _CellGrid.CellGrid(rows, columns);
        grid.reset();
    };

    var reset = function reset() {
        gameFinished = false;
    };

    var getState = function getState() {
        return gameFinished;
    };

    var start = function start(height, width) {
        this.reset();
        this.setGrid(height, width);
        var goNow = setInterval(function () {
            if (getState() == true) {
                alert("DONE");
                clearInterval(goNow);
            }
            next();
        }, 1000);
    };

    var next = function next() {
        grid.step();
        squares = squares.data(grid.aliveCells(), function (d) {
            return d.n;
        });
        console.log(grid.aliveCells());
        // Loop through all our live cells
        squares.enter().append("rect").attr("x", function (d) {
            return d.x * wRatio;
        }).attr("y", function (d) {
            return d.y * hRatio;
        }).attr("width", wRatio).attr("height", wRatio).transition().duration(500).style("fill", "#0C5CB6");

        squares.exit().style("fill", "#6DA13E").transition().duration(500).remove();

        if (grid.aliveCells() == 0) {
            gameFinished = true;
        }
    };

    return {
        next: next,
        start: start,
        getState: getState,
        reset: reset,
        setGrid: setGrid
    };
};

},{"./Cell":1,"./CellGrid":2}],4:[function(require,module,exports){
'use strict';

var _GameOfLife = require('./GameOfLife');

var Game = new _GameOfLife.GameOfLife('#viz');

$("#submitForm").on("submit", function (e) {
    e.preventDefault();
    var height = $("#height").val();
    var width = $("#width").val();
    Game.start(height, width);
});

},{"./GameOfLife":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9DZWxsLmpzIiwianMvQ2VsbEdyaWQuanMiLCJqcy9HYW1lT2ZMaWZlLmpzIiwianMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDQWdCO0FBQVQsU0FBUyxJQUFULENBQWMsWUFBZCxFQUE0QjtBQUMvQixTQUFLLE9BQUwsR0FBZSxZQUFmLENBRCtCO0FBRS9CLFNBQUssV0FBTCxHQUFtQixLQUFuQixDQUYrQjtDQUE1Qjs7QUFLUCxLQUFLLFNBQUwsQ0FBZSxnQkFBZixHQUFrQyxVQUFTLG1CQUFULEVBQThCO0FBQzVELFFBQUcsdUJBQXVCLENBQXZCLEVBQXlCO0FBQ3hCLGFBQUssV0FBTCxHQUFtQixJQUFuQixDQUR3QjtLQUE1QixNQUVPLElBQUcsc0JBQXNCLENBQXRCLElBQTJCLHNCQUFzQixDQUF0QixFQUF5QjtBQUMxRCxhQUFLLFdBQUwsR0FBbUIsS0FBbkIsQ0FEMEQ7S0FBdkQsTUFFQTtBQUNILGFBQUssV0FBTCxHQUFtQixLQUFLLE9BQUwsQ0FEaEI7S0FGQTs7QUFNUCxXQUFPLEtBQUssV0FBTCxDQVRxRDtDQUE5Qjs7QUFZbEMsS0FBSyxTQUFMLENBQWUsU0FBZixHQUEyQixZQUFVO0FBQ2pDLFNBQUssT0FBTCxHQUFlLEtBQUssV0FBTCxDQURrQjtDQUFWOzs7Ozs7OztRQ2RYOzs7O0FBQVQsU0FBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCLE9BQXhCLEVBQWlDO0FBQ3BDLFNBQUssS0FBTCxHQUFhLElBQUksS0FBSixDQUFVLElBQVYsQ0FBYixDQURvQztBQUVwQyxRQUFJLElBQUksQ0FBSixDQUZnQztBQUdwQyxTQUFJLElBQUksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFFLENBQUYsR0FBTSxJQUFOLEdBQVk7QUFDeEIsYUFBSyxLQUFMLENBQVcsQ0FBWCxJQUFnQixJQUFJLEtB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ZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBmdW5jdGlvbiBDZWxsKGluaXRpYWxTdGF0ZSkge1xuICAgIHRoaXMuaXNBbGl2ZSA9IGluaXRpYWxTdGF0ZTtcbiAgICB0aGlzLndpbGxCZUFsaXZlID0gZmFsc2U7XG59XG5cbkNlbGwucHJvdG90eXBlLmNvbXB1dGVOZXh0U3RhdGUgPSBmdW5jdGlvbihhbGl2ZU5laWdoYm9yc0NvdW50KSB7XG4gICAgaWYoYWxpdmVOZWlnaGJvcnNDb3VudCA9PSAzKXtcbiAgICAgICAgdGhpcy53aWxsQmVBbGl2ZSA9IHRydWU7XG4gICAgfSBlbHNlIGlmKGFsaXZlTmVpZ2hib3JzQ291bnQgPiAzIHx8IGFsaXZlTmVpZ2hib3JzQ291bnQgPCAyKSB7XG4gICAgICAgIHRoaXMud2lsbEJlQWxpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndpbGxCZUFsaXZlID0gdGhpcy5pc0FsaXZlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLndpbGxCZUFsaXZlO1xufTtcblxuQ2VsbC5wcm90b3R5cGUubmV4dFN0YXRlID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmlzQWxpdmUgPSB0aGlzLndpbGxCZUFsaXZlO1xufSIsImltcG9ydCB7IENlbGwgfSBmcm9tICcuL0NlbGwnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBDZWxsR3JpZChyb3dzLCBjb2x1bW5zKSB7XG4gICAgdGhpcy5jZWxscyA9IG5ldyBBcnJheShyb3dzKTtcbiAgICB2YXIgbiA9IDA7XG4gICAgZm9yKHZhciBpID0gLTE7ICsraSA8IHJvd3M7KXtcbiAgICAgICAgdGhpcy5jZWxsc1tpXSA9IG5ldyBBcnJheShjb2x1bW5zKTtcbiAgICAgICAgZm9yKHZhciBqID0gLTE7ICsraiA8IGNvbHVtbnM7ICl7XG4gICAgICAgICAgICB2YXIgY2VsbCA9IG5ldyBDZWxsKGZhbHNlKTtcbiAgICAgICAgICAgIGNlbGwubiA9IG4rKztcbiAgICAgICAgICAgIGNlbGwueCA9IGk7XG4gICAgICAgICAgICBjZWxsLnkgPSBqO1xuICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVtqXSA9IGNlbGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkNlbGxHcmlkLnByb3RvdHlwZS5hbGl2ZU5laWdoYm9yc0ZvciA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIG5laWdoYm9ycyA9IFtbLTEsLTFdLFstMSwwXSxbLTEsMV0sWzAsLTFdLFswLDFdLFsxLC0xXSxbMSwwXSxbMSwxXV07XG5cbiAgICBmdW5jdGlvbiBpc0FsaXZlQXQoaSwgail7XG4gICAgICAgIGlmKGkgPCAwIHx8IGkgPj0gc2VsZi5jZWxscy5sZW5ndGggfHwgaiA8IDAgfHwgaiA+PSBzZWxmLmNlbGxzWzBdLmxlbmd0aCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGYuY2VsbHNbaV1bal0uaXNBbGl2ZTtcbiAgICB9XG5cbiAgICB2YXIgY291bnQgPSAwO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBuZWlnaGJvcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICBjb3VudCArPSAoaXNBbGl2ZUF0KHgrbmVpZ2hib3JzW2ldWzBdLHkrbmVpZ2hib3JzW2ldWzFdKSk/MTowO1xuICAgIH1cblxuICAgIHJldHVybiBjb3VudDtcbn07XG5cbkNlbGxHcmlkLnByb3RvdHlwZS5lYWNoQ2VsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICB2YXIgcm93cyA9IHRoaXMuY2VsbHMubGVuZ3RoLFxuICAgICAgICBjb2x1bW5zID0gdGhpcy5jZWxsc1swXS5sZW5ndGgsXG4gICAgICAgIHgseTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcm93cyAqIGNvbHVtbnM7IGkrKyl7XG4gICAgICAgIHggPSBpJXJvd3M7IHkgPSBNYXRoLmZsb29yKGkvcm93cyk7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsW3RoaXMuY2VsbHNbeF1beV0seCx5XSk7XG4gICAgfVxufTtcblxuQ2VsbEdyaWQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmVhY2hDZWxsKGZ1bmN0aW9uKGNlbGwseCx5KXtcbiAgICAgICAgY2VsbC5pc0FsaXZlID0gKE1hdGgucmFuZG9tKCkgPiAwLjUpO1xuICAgIH0pO1xufTtcblxuQ2VsbEdyaWQucHJvdG90eXBlLnByZXBhcmVTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lYWNoQ2VsbChmdW5jdGlvbihjZWxsLHgseSl7XG4gICAgICAgIGNlbGwuY29tcHV0ZU5leHRTdGF0ZSh0aGlzLmFsaXZlTmVpZ2hib3JzRm9yKHgseSkpO1xuICAgIH0pO1xufTtcblxuQ2VsbEdyaWQucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnByZXBhcmVTdGVwKCk7XG4gICAgdGhpcy5lYWNoQ2VsbChmdW5jdGlvbihjZWxsLHgseSl7XG4gICAgICAgIGNlbGwubmV4dFN0YXRlKCk7XG4gICAgfSk7XG59O1xuXG5DZWxsR3JpZC5wcm90b3R5cGUuYWxpdmVDZWxscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbGl2ZSA9IFtdO1xuICAgIHRoaXMuZWFjaENlbGwoZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgIGNlbGwuaXNBbGl2ZSAmJiBhbGl2ZS5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICAgIHJldHVybiBhbGl2ZTtcbn07IiwiaW1wb3J0IHsgQ2VsbEdyaWQgfSBmcm9tICcuL0NlbGxHcmlkJztcbmltcG9ydCB7IENlbGwgfSBmcm9tICcuL0NlbGwnO1xuXG5leHBvcnQgZnVuY3Rpb24gR2FtZU9mTGlmZShzZWxlY3Rvcil7XG5cbiAgICB2YXIgc2VsZWN0b3IgPSBzZWxlY3RvcjtcblxuICAgIHZhciBzcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5vZmZzZXRXaWR0aDtcblxuICAgIHZhciBnYW1lRmluaXNoZWQgPSBmYWxzZTtcblxuICAgIHZhciBzdmcgPSBkMy5zZWxlY3Qoc2VsZWN0b3IpLmFwcGVuZChcInN2ZzpzdmdcIilcbiAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBzcXVhcmUpXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHNxdWFyZSk7XG5cbiAgICB2YXIgc3F1YXJlcyA9IHN2Zy5zZWxlY3RBbGwoXCJzcXVhcmVcIik7XG5cbiAgICB2YXIgZ3JpZCx3UmF0aW8saFJhdGlvLHJhZGl1cztcblxuICAgIHZhciBzZXRHcmlkID0gZnVuY3Rpb24oeCx5KXtcbiAgICAgICAgdmFyIGNvbHVtbnMgPSB4O1xuICAgICAgICB2YXIgcm93cyA9IHk7XG5cbiAgICAgICAgd1JhdGlvID0gc3F1YXJlL2NvbHVtbnMsXG4gICAgICAgIGhSYXRpbyA9IHNxdWFyZS9yb3dzLFxuICAgICAgICBncmlkID0gbmV3IENlbGxHcmlkKHJvd3MsY29sdW1ucyk7XG4gICAgICAgIGdyaWQucmVzZXQoKTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGdhbWVGaW5pc2hlZCA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0U3RhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZ2FtZUZpbmlzaGVkO1xuICAgIH07XG5cbiAgICB2YXIgc3RhcnQgPSBmdW5jdGlvbihoZWlnaHQsd2lkdGgpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLnNldEdyaWQoaGVpZ2h0LHdpZHRoKTtcbiAgICAgICAgdmFyIGdvTm93ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKGdldFN0YXRlKCkgPT0gdHJ1ZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIkRPTkVcIik7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnb05vdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH07XG5cbiAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGdyaWQuc3RlcCgpO1xuICAgICAgICBzcXVhcmVzID0gc3F1YXJlcy5kYXRhKGdyaWQuYWxpdmVDZWxscygpLGZ1bmN0aW9uKGQpe3JldHVybiBkLm59KTtcbiAgICAgICAgY29uc29sZS5sb2coZ3JpZC5hbGl2ZUNlbGxzKCkpO1xuICAgICAgICAvLyBMb29wIHRocm91Z2ggYWxsIG91ciBsaXZlIGNlbGxzXG4gICAgICAgIHNxdWFyZXMuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQpe3JldHVybiBkLngqd1JhdGlvfSlcbiAgICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCl7cmV0dXJuIGQueSpoUmF0aW99KVxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIix3UmF0aW8pXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIix3UmF0aW8pXG4gICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLFwiIzBDNUNCNlwiKTtcblxuICAgICAgICBzcXVhcmVzLmV4aXQoKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLFwiIzZEQTEzRVwiKVxuICAgICAgICAgICAgLnRyYW5zaXRpb24oKS5kdXJhdGlvbig1MDApXG4gICAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgaWYoZ3JpZC5hbGl2ZUNlbGxzKCkgPT0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgZ2FtZUZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG5leHQ6IG5leHQsXG4gICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgZ2V0U3RhdGU6Z2V0U3RhdGUsXG4gICAgICAgIHJlc2V0OnJlc2V0LFxuICAgICAgICBzZXRHcmlkOnNldEdyaWRcbiAgICAgfTtcblxufTsiLCJpbXBvcnQgeyBHYW1lT2ZMaWZlIH0gZnJvbSAnLi9HYW1lT2ZMaWZlJztcblxudmFyIEdhbWUgPSBuZXcgR2FtZU9mTGlmZSgnI3ZpeicpO1xuXG4kKFwiI3N1Ym1pdEZvcm1cIikub24oXCJzdWJtaXRcIixmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGhlaWdodCA9ICQoXCIjaGVpZ2h0XCIpLnZhbCgpO1xuICAgIHZhciB3aWR0aCA9ICQoXCIjd2lkdGhcIikudmFsKCk7XG4gICAgR2FtZS5zdGFydChoZWlnaHQsd2lkdGgpO1xufSk7XG4iXX0=
