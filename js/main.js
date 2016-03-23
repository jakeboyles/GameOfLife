import { GameOfLife } from './GameOfLife';

var Game = new GameOfLife('#viz');

$("#submitForm").on("submit",function(e){
    e.preventDefault();
    var height = $("#height").val();
    var width = $("#width").val();
    Game.start(height,width);
});
