import { CellGrid } from './CellGrid';
import { Cell } from './Cell';

export function GameOfLife(selector){

    var selector = selector;

    var square = document.querySelector(selector).offsetWidth;

    var gameFinished = false;

    var svg = d3.select(selector).append("svg:svg")
        .attr("width", square)
        .attr("height", square);

    var squares = svg.selectAll("square");

    var grid,wRatio,hRatio,radius;

    var setGrid = function(x,y){
        var columns = x;
        var rows = y;

        wRatio = square/columns,
        hRatio = square/rows,
        grid = new CellGrid(rows,columns);
        grid.reset();
    };

    var reset = function() {
        gameFinished = false;
    };

    var getState = function(){
        return gameFinished;
    };

    var start = function(height,width) {
        this.reset();
        this.setGrid(height,width);
        var goNow = setInterval(function(){
            if(getState() == true)
            {
                alert("DONE");
                clearInterval(goNow);
            }
            next();
        }, 1000);
    };

    var next = function(){
        grid.step();
        squares = squares.data(grid.aliveCells(),function(d){return d.n});
        console.log(grid.aliveCells());
        // Loop through all our live cells
        squares.enter().append("rect")
                .attr("x", function(d){return d.x*wRatio})
                .attr("y", function(d){return d.y*hRatio})
                .attr("width",wRatio)
                .attr("height",wRatio)
                .transition().duration(500)
                .style("fill","#0C5CB6");

        squares.exit()
            .style("fill","#6DA13E")
            .transition().duration(500)
            .remove();

        if(grid.aliveCells() == 0)
        {
            gameFinished = true;
        }

    };

    return {
        next: next,
        start: start,
        getState:getState,
        reset:reset,
        setGrid:setGrid
     };

};