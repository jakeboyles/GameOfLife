import { CellGrid } from './CellGrid';
import { Cell } from './Cell';


function GameOfLife(selector){

    var this = this;

    var selector = selector;

    var square = document.querySelector(selector).offsetWidth;

    var gameFinished = false;

    var svg = d3.select(selector).append("svg:svg")
        .attr("width", square)
        .attr("height", square);

    var circle = svg.selectAll("circle");

    var grid,wRatio,hRatio,radius;


    this.setGrid = function(x,y){
        var columns = x;
        var rows = y;

        wRatio = square/columns,
        hRatio = square/rows,
        radius = Math.min(Math.floor(square/(2*columns)),Math.floor(square/(2*rows)));

        grid = new CellGrid(rows,columns);

        grid.reset();

    }

    this.reset = function() {
        gameFinished = false;
    }

    this.getState = function(){
        return gameFinished;
    }

    this.start = function() {
        var goNow = setInterval(function(){
        if(this.getState() == true)
        {
            clearInterval(goNow);
        }
        this.next();
        }, 500);
    }

    this.next = function(){
        grid.step();

        // Get all the alive cells
        circle = circle.data(grid.aliveCells(),function(d){return d.n});

        // Loop through all our live cells
        circle.enter().append("circle")
                .attr("cx", function(d){return d.x*wRatio + radius})
                .attr("cy", function(d){return d.y*hRatio + radius})
                .transition().duration(500)
                    .attr("r", radius)
                    .style("fill","#0C5CB6");

        // Exit that circle with another animation
        circle.exit()
            .style("fill","#6DA13E")
            .transition().duration(500)
                .attr("r", 0)
            .remove();

        // Wait one second and do it again.

        setTimeout(this.start,500);

        if(grid.aliveCells() == 0 )
        {
            gameFinished = true;
        }

    };

};



var GameOfLife = new GameOfLife('#viz');

$("#submitForm").on("submit",function(e){
    GameOfLife.reset();
    e.preventDefault();
    var height = $("#height").val();
    var width = $("#width").val();

    GameOfLife.setGrid(height,width);

    GameOfLife.start();
});
