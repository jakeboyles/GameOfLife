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
    var alive = [];
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
    this.alive = alive;
    return alive;
};
CellGrid.prototype.aliveCellsCount = function () {
    return this.alive.length;
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

    var speed = 1000;

    var moves = [];

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
        moves = [];
        gameFinished = false;
    };

    var getState = function getState(gameFinishedFuck) {
        return gameFinished;
    };

    var start = function start(height, width, speed) {
        this.reset();
        speed = speed;
        this.setGrid(height, width);
        var goNow = setInterval(function () {
            if (getState() == true) {
                alert("DONE");
                clearInterval(goNow);
            }
            next();
        }, speed);
    };

    var setAnimationSpeed = function setAnimationSpeed(speed) {
        speed = speed;
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

        moves.push(grid.aliveCellsCount());
        $(".aliveCells").html(grid.aliveCellsCount());
    };

    return {
        next: next,
        start: start,
        getState: getState,
        reset: reset,
        setGrid: setGrid,
        setAnimationSpeed: setAnimationSpeed
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
    var speed = $("#speed").val();
    Game.start(height, width, speed);
});

$("#reset").on("click", function () {
    Game.reset();
});

},{"./GameOfLife":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9DZWxsLmpzIiwianMvQ2VsbEdyaWQuanMiLCJqcy9HYW1lT2ZMaWZlLmpzIiwianMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDQWdCO0FBQVQsU0FBUyxJQUFULENBQWMsWUFBZCxFQUE0QjtBQUMvQixTQUFLLE9BQUwsR0FBZSxZQUFmLENBRCtCO0FBRS9CLFNBQUssV0FBTCxHQUFtQixLQUFuQixDQUYrQjtDQUE1Qjs7QUFLUCxLQUFLLFNBQUwsQ0FBZSxnQkFBZixHQUFrQyxVQUFTLG1CQUFULEVBQThCO0FBQzVELFFBQUcsdUJBQXVCLENBQXZCLEVBQXlCO0FBQ3hCLGFBQUssV0FBTCxHQUFtQixJQUFuQixDQUR3QjtLQUE1QixNQUVPLElBQUcsc0JBQXNCLENBQXRCLElBQTJCLHNCQUFzQixDQUF0QixFQUF5QjtBQUMxRCxhQUFLLFdBQUwsR0FBbUIsS0FBbkIsQ0FEMEQ7S0FBdkQsTUFFQTtBQUNILGFBQUssV0FBTCxHQUFtQixLQUFLLE9BQUwsQ0FEaEI7S0FGQTs7QUFNUCxXQUFPLEtBQUssV0FBTCxDQVRxRDtDQUE5Qjs7QUFZbEMsS0FBSyxTQUFMLENBQWUsU0FBZixHQUEyQixZQUFVO0FBQ2pDLFNBQUssT0FBTCxHQUFlLEtBQUssV0FBTCxDQURrQjtDQUFWOzs7Ozs7OztRQ2RYOzs7O0FBQVQsU0FBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCLE9BQXhCLEVBQWlDO0FBQ3BDLFFBQUksUUFBUSxFQUFSLENBRGdDO0FBRXBDLFNBQUssS0FBTCxHQUFhLElBQUksS0FBSixDQUFVLElBQVYsQ0FBYixDQUZvQztBQUdwQyxRQUFJLElBQUksQ0FBSixDQUhnQztBQUlwQyxTQUFJLElBQUksSUFBSSxDQUFDLENBQUQsRUFBSSxFQUFFLENBQUYsR0FBTSxJQUFOLEdBQVk7QUFDeEIsYUFBSyxL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QUNBLGVBQU0sS0FBTjtBQUNBLGlCQUFRLE9BQVI7QUFDQSwyQkFBa0IsaUJBQWxCO0tBTkosQ0FuRmdDO0NBQTdCOzs7Ozs7O0FDRFAsSUFBSSxPQUFPLDJCQUFlLE1BQWYsQ0FBUDs7QUFFSixFQUFFLGFBQUYsRUFBaUIsRUFBakIsQ0FBb0IsUUFBcEIsRUFBNkIsVUFBUyxDQUFULEVBQVc7QUFDcEMsTUFBRSxjQUFGLEdBRG9DO0FBRXBDLFFBQUksU0FBUyxFQUFFLFNBQUYsRUFBYSxHQUFiLEVBQVQsQ0FGZ0M7QUFHcEMsUUFBSSxRQUFRLEVBQUUsUUFBRixFQUFZLEdBQVosRUFBUixDQUhnQztBQUlwQyxRQUFJLFFBQVEsRUFBRSxRQUFGLEVBQVksR0FBWixFQUFSLENBSmdDO0FBS3BDLFNBQUssS0FBTCxDQUFXLE1BQVgsRUFBa0IsS0FBbEIsRUFBd0IsS0FBeEIsRUFMb0M7Q0FBWCxDQUE3Qjs7QUFTQSxFQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF1QixZQUFVO0FBQ2hDLFNBQUssS0FBTCxHQURnQztDQUFWLENBQXZCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBmdW5jdGlvbiBDZWxsKGluaXRpYWxTdGF0ZSkge1xuICAgIHRoaXMuaXNBbGl2ZSA9IGluaXRpYWxTdGF0ZTtcbiAgICB0aGlzLndpbGxCZUFsaXZlID0gZmFsc2U7XG59XG5cbkNlbGwucHJvdG90eXBlLmNvbXB1dGVOZXh0U3RhdGUgPSBmdW5jdGlvbihhbGl2ZU5laWdoYm9yc0NvdW50KSB7XG4gICAgaWYoYWxpdmVOZWlnaGJvcnNDb3VudCA9PSAzKXtcbiAgICAgICAgdGhpcy53aWxsQmVBbGl2ZSA9IHRydWU7XG4gICAgfSBlbHNlIGlmKGFsaXZlTmVpZ2hib3JzQ291bnQgPiAzIHx8IGFsaXZlTmVpZ2hib3JzQ291bnQgPCAyKSB7XG4gICAgICAgIHRoaXMud2lsbEJlQWxpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndpbGxCZUFsaXZlID0gdGhpcy5pc0FsaXZlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLndpbGxCZUFsaXZlO1xufTtcblxuQ2VsbC5wcm90b3R5cGUubmV4dFN0YXRlID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmlzQWxpdmUgPSB0aGlzLndpbGxCZUFsaXZlO1xufSIsImltcG9ydCB7IENlbGwgfSBmcm9tICcuL0NlbGwnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBDZWxsR3JpZChyb3dzLCBjb2x1bW5zKSB7XG4gICAgdmFyIGFsaXZlID0gW107XG4gICAgdGhpcy5jZWxscyA9IG5ldyBBcnJheShyb3dzKTtcbiAgICB2YXIgbiA9IDA7XG4gICAgZm9yKHZhciBpID0gLTE7ICsraSA8IHJvd3M7KXtcbiAgICAgICAgdGhpcy5jZWxsc1tpXSA9IG5ldyBBcnJheShjb2x1bW5zKTtcbiAgICAgICAgZm9yKHZhciBqID0gLTE7ICsraiA8IGNvbHVtbnM7ICl7XG4gICAgICAgICAgICB2YXIgY2VsbCA9IG5ldyBDZWxsKGZhbHNlKTtcbiAgICAgICAgICAgIGNlbGwubiA9IG4rKztcbiAgICAgICAgICAgIGNlbGwueCA9IGk7XG4gICAgICAgICAgICBjZWxsLnkgPSBqO1xuICAgICAgICAgICAgdGhpcy5jZWxsc1tpXVtqXSA9IGNlbGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkNlbGxHcmlkLnByb3RvdHlwZS5hbGl2ZU5laWdoYm9yc0ZvciA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIG5laWdoYm9ycyA9IFtbLTEsLTFdLFstMSwwXSxbLTEsMV0sWzAsLTFdLFswLDFdLFsxLC0xXSxbMSwwXSxbMSwxXV07XG5cbiAgICBmdW5jdGlvbiBpc0FsaXZlQXQoaSwgail7XG4gICAgICAgIGlmKGkgPCAwIHx8IGkgPj0gc2VsZi5jZWxscy5sZW5ndGggfHwgaiA8IDAgfHwgaiA+PSBzZWxmLmNlbGxzWzBdLmxlbmd0aCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGYuY2VsbHNbaV1bal0uaXNBbGl2ZTtcbiAgICB9XG5cbiAgICB2YXIgY291bnQgPSAwO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBuZWlnaGJvcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICBjb3VudCArPSAoaXNBbGl2ZUF0KHgrbmVpZ2hib3JzW2ldWzBdLHkrbmVpZ2hib3JzW2ldWzFdKSk/MTowO1xuICAgIH1cblxuICAgIHJldHVybiBjb3VudDtcbn07XG5cbkNlbGxHcmlkLnByb3RvdHlwZS5lYWNoQ2VsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICB2YXIgcm93cyA9IHRoaXMuY2VsbHMubGVuZ3RoLFxuICAgICAgICBjb2x1bW5zID0gdGhpcy5jZWxsc1swXS5sZW5ndGgsXG4gICAgICAgIHgseTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcm93cyAqIGNvbHVtbnM7IGkrKyl7XG4gICAgICAgIHggPSBpJXJvd3M7IHkgPSBNYXRoLmZsb29yKGkvcm93cyk7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsW3RoaXMuY2VsbHNbeF1beV0seCx5XSk7XG4gICAgfVxufTtcblxuQ2VsbEdyaWQucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKXtcbiAgICB0aGlzLmVhY2hDZWxsKGZ1bmN0aW9uKGNlbGwseCx5KXtcbiAgICAgICAgY2VsbC5pc0FsaXZlID0gKE1hdGgucmFuZG9tKCkgPiAwLjUpO1xuICAgIH0pO1xufTtcblxuQ2VsbEdyaWQucHJvdG90eXBlLnByZXBhcmVTdGVwID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lYWNoQ2VsbChmdW5jdGlvbihjZWxsLHgseSl7XG4gICAgICAgIGNlbGwuY29tcHV0ZU5leHRTdGF0ZSh0aGlzLmFsaXZlTmVpZ2hib3JzRm9yKHgseSkpO1xuICAgIH0pO1xufTtcblxuQ2VsbEdyaWQucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnByZXBhcmVTdGVwKCk7XG4gICAgdGhpcy5lYWNoQ2VsbChmdW5jdGlvbihjZWxsLHgseSl7XG4gICAgICAgIGNlbGwubmV4dFN0YXRlKCk7XG4gICAgfSk7XG59O1xuXG5DZWxsR3JpZC5wcm90b3R5cGUuYWxpdmVDZWxscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbGl2ZSA9IFtdO1xuICAgIHRoaXMuZWFjaENlbGwoZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgIGNlbGwuaXNBbGl2ZSAmJiBhbGl2ZS5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICAgIHRoaXMuYWxpdmUgPSBhbGl2ZTtcbiAgICByZXR1cm4gYWxpdmU7XG59O1xuQ2VsbEdyaWQucHJvdG90eXBlLmFsaXZlQ2VsbHNDb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFsaXZlLmxlbmd0aDtcbn07IiwiaW1wb3J0IHsgQ2VsbEdyaWQgfSBmcm9tICcuL0NlbGxHcmlkJztcbmltcG9ydCB7IENlbGwgfSBmcm9tICcuL0NlbGwnO1xuXG5leHBvcnQgZnVuY3Rpb24gR2FtZU9mTGlmZShzZWxlY3Rvcil7XG5cbiAgICB2YXIgc3BlZWQgPSAxMDAwO1xuXG4gICAgdmFyIG1vdmVzID0gW107XG5cbiAgICB2YXIgc2VsZWN0b3IgPSBzZWxlY3RvcjtcblxuICAgIHZhciBzcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5vZmZzZXRXaWR0aDtcblxuICAgIHZhciBnYW1lRmluaXNoZWQgPSBmYWxzZTtcblxuICAgIHZhciBzdmcgPSBkMy5zZWxlY3Qoc2VsZWN0b3IpLmFwcGVuZChcInN2ZzpzdmdcIilcbiAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBzcXVhcmUpXG4gICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHNxdWFyZSk7XG5cbiAgICB2YXIgc3F1YXJlcyA9IHN2Zy5zZWxlY3RBbGwoXCJzcXVhcmVcIik7XG5cbiAgICB2YXIgZ3JpZCx3UmF0aW8saFJhdGlvLHJhZGl1cztcblxuICAgIHZhciBzZXRHcmlkID0gZnVuY3Rpb24oeCx5KXtcbiAgICAgICAgdmFyIGNvbHVtbnMgPSB4O1xuICAgICAgICB2YXIgcm93cyA9IHk7XG5cbiAgICAgICAgd1JhdGlvID0gc3F1YXJlL2NvbHVtbnMsXG4gICAgICAgIGhSYXRpbyA9IHNxdWFyZS9yb3dzLFxuICAgICAgICBncmlkID0gbmV3IENlbGxHcmlkKHJvd3MsY29sdW1ucyk7XG4gICAgICAgIGdyaWQucmVzZXQoKTtcbiAgICB9O1xuXG4gICAgdmFyIHJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG1vdmVzID0gW107XG4gICAgICAgIGdhbWVGaW5pc2hlZCA9IGZhbHNlO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0U3RhdGUgPSBnYW1lRmluaXNoZWRGdWNrID0+IGdhbWVGaW5pc2hlZDtcblxuICAgIHZhciBzdGFydCA9IGZ1bmN0aW9uKGhlaWdodCx3aWR0aCxzcGVlZCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHNwZWVkID0gc3BlZWQ7XG4gICAgICAgIHRoaXMuc2V0R3JpZChoZWlnaHQsd2lkdGgpO1xuICAgICAgICB2YXIgZ29Ob3cgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoZ2V0U3RhdGUoKSA9PSB0cnVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRE9ORVwiKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdvTm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSwgc3BlZWQpO1xuICAgIH07XG5cbiAgICB2YXIgc2V0QW5pbWF0aW9uU3BlZWQgPSBmdW5jdGlvbihzcGVlZCl7XG4gICAgICAgIHNwZWVkID0gc3BlZWQ7XG4gICAgfVxuXG4gICAgdmFyIG5leHQgPSBmdW5jdGlvbigpe1xuICAgICAgICBncmlkLnN0ZXAoKTtcbiAgICAgICAgc3F1YXJlcyA9IHNxdWFyZXMuZGF0YShncmlkLmFsaXZlQ2VsbHMoKSxkID0+IGQubik7XG4gICAgICAgIGNvbnNvbGUubG9nKGdyaWQuYWxpdmVDZWxscygpKTtcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGFsbCBvdXIgbGl2ZSBjZWxsc1xuICAgICAgICBzcXVhcmVzLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBkID0+IGQueCp3UmF0aW8pXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGQgPT4gZC55KmhSYXRpbylcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsd1JhdGlvKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsd1JhdGlvKVxuICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIixcIiMwQzVDQjZcIik7XG5cbiAgICAgICAgc3F1YXJlcy5leGl0KClcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIixcIiM2REExM0VcIilcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oNTAwKVxuICAgICAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmKGdyaWQuYWxpdmVDZWxscygpID09IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGdhbWVGaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBtb3Zlcy5wdXNoKGdyaWQuYWxpdmVDZWxsc0NvdW50KCkpO1xuICAgICAgICAkKFwiLmFsaXZlQ2VsbHNcIikuaHRtbChncmlkLmFsaXZlQ2VsbHNDb3VudCgpKTtcblxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBuZXh0OiBuZXh0LFxuICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgIGdldFN0YXRlOmdldFN0YXRlLFxuICAgICAgICByZXNldDpyZXNldCxcbiAgICAgICAgc2V0R3JpZDpzZXRHcmlkLFxuICAgICAgICBzZXRBbmltYXRpb25TcGVlZDpzZXRBbmltYXRpb25TcGVlZFxuICAgICB9O1xuXG59OyIsImltcG9ydCB7IEdhbWVPZkxpZmUgfSBmcm9tICcuL0dhbWVPZkxpZmUnO1xuXG52YXIgR2FtZSA9IG5ldyBHYW1lT2ZMaWZlKCcjdml6Jyk7XG5cbiQoXCIjc3VibWl0Rm9ybVwiKS5vbihcInN1Ym1pdFwiLGZ1bmN0aW9uKGUpe1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgaGVpZ2h0ID0gJChcIiNoZWlnaHRcIikudmFsKCk7XG4gICAgdmFyIHdpZHRoID0gJChcIiN3aWR0aFwiKS52YWwoKTtcbiAgICB2YXIgc3BlZWQgPSAkKFwiI3NwZWVkXCIpLnZhbCgpO1xuICAgIEdhbWUuc3RhcnQoaGVpZ2h0LHdpZHRoLHNwZWVkKTtcbn0pO1xuXG5cbiQoXCIjcmVzZXRcIikub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7XG5cdEdhbWUucmVzZXQoKTtcbn0pIl19
