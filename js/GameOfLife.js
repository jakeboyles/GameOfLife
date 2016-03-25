import { CellGrid } from './CellGrid';
import { Cell } from './Cell';

export function GameOfLife(selector){

    var speed = 1000;

    var moves = [];

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
        moves = [];
        gameFinished = false;
    };

    var getState = gameFinished => gameFinished;

    var start = function(height,width,speed) {
        this.reset();
        speed = speed;
        this.setGrid(height,width);
        var goNow = setInterval(function(){
            if(getState() == true)
            {
                alert("DONE");
                clearInterval(goNow);
            }
            next();
        }, speed);
    };

    var setAnimationSpeed = function(speed){
        speed = speed;
    }

    var next = function(){
        grid.step();
        squares = squares.data(grid.aliveCells(),d => d.n);
        console.log(grid.aliveCells());
        // Loop through all our live cells
        squares.enter().append("rect")
                .attr("x", d => d.x*wRatio)
                .attr("y", d => d.y*hRatio)
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

        moves.push(grid.aliveCellsCount());
        $(".aliveCells").html(grid.aliveCellsCount());

    };

    return {
        next: next,
        start: start,
        getState:getState,
        reset:reset,
        setGrid:setGrid,
        setAnimationSpeed:setAnimationSpeed
     };

};