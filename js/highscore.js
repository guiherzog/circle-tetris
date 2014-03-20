
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
		li_highscore[i].innerHTML = "<h3 align='center' id='name'>No highscore...</h3><p align='center'><br>How about completing some circles...?</p><div class='line-separator'></div>";
	}
	for (var i = 0; i <highscores.length;i++)
	{
		// console.log("Entrei no for "+(i+1)+" vezes");
		var score = highscores[i].score;
		var name = highscores[i].name;
		if (score > 0)
		{
			var li = document.createElement("li");
			li.className = "highscore-item";

			var h3 = document.createElement("h3");
			h3.className = "name";
			h3.appendChild(document.createTextNode((i+1) + ". " + name));

			var h5 = document.createElement("h5");
			h5.className = "score";
			h5.appendChild(document.createTextNode(score + " pts"));

			var div = document.createElement("div");
			div.className = "line-separator";

			li.appendChild(h3);
			li.appendChild(h5);
			li.appendChild(div);

			leaderboardDiv.appendChild(li);
		}
	}
			
});

	