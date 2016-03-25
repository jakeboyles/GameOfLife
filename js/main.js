import { GameOfLife } from './GameOfLife';

var Game = new GameOfLife('#viz');

$("#submitForm").on("submit",function(e){
    e.preventDefault();
    var height = $("#height").val();
    var width = $("#width").val();
    var speed = $("#speed").val();
    Game.start(height,width,speed);
});


$("#reset").on("click",function(){
	Game.reset();
})