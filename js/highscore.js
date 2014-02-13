
window.onload = function()
{
	var name = document.getElementById("highscore-value");
	console.log(name);
	highscore_local = localStorage.getItem("highscore");
	name.innerHTML = highscore_local + " pts";

}
	