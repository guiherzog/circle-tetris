
document.addEventListener("DOMContentLoaded", function()
{
	var highscore_item = document.getElementById("highscore-item");
	var leaderboardDiv = document.getElementById('leaderboardDiv');
	var li_highscore = [];
	console.log(highscore_item);

	// Pega o obj de highscores
	highscores = JSON.parse(localStorage.getItem("highscores"));

	// Se for zero, imprime sem highscores na tela.
	if (highscores == null)
	{
		li_highscore[i] = document.createElement('li');		
		leaderboardDiv.appendChild(li_highscore[i]);
		li_highscore[i].className = 'highscore-item';
		li_highscore[i].innerHTML = "<h3 align='center' id='name'> Sem recordes... </h3><p align='center'><br> Que tal jogar um pouco...?</p><div class='line-separator'></div>";
	}
	for (var i = 0; i <highscores.length;i++)
	{
		// console.log("Entrei no for "+(i+1)+" vezes");
		var score = highscores[i].score;
		var name = highscores[i].name;
		if (score > 0)
		{
			li_highscore[i] = document.createElement('li');		
			leaderboardDiv.appendChild(li_highscore[i]);
			li_highscore[i].className = 'highscore-item';
			li_highscore[i].innerHTML = "<h3 id='name'>"+(i+1)+"º - "+name+"</h3><h5 id='score'>"+score+" pontos</h5><div class='line-separator'></div>";
		}
	}
			
});

	