		
		// Atributos de configuração do Jogo
		if(!window.devicePixelRatio) window.devicePixelRatio = 1;
		
		var largura_total = window.innerWidth * window.devicePixelRatio;
		var altura_total = window.innerHeight * window.devicePixelRatio;


		
		var touch;
		var touch_context;
		var last_pt = null;
		
		var largura = largura_total;
		var altura_touch = parseInt(altura_total / 10, 10);
		var altura = altura_total - altura_touch;
		
		function min(a, b) { return a < b ? a : b; }
		function max(a, b) { return a > b ? a : b; }
		
		var menor = min(largura, altura);
		
		var dist = largura/2;
		
		var blocos = [];
		
		var grossura = menor/32; // altura das pecas
		var quantas = 24; // quantas pecas por "linha" (largura de cada será calculada automaticamente)
		var tamanho = (Math.PI/quantas)*2; // largura das pecas
		var pontos = 0;
		var level = 0;
		
		var resto = (largura/2 - (menor/8 + (grossura/2))) % grossura;
		var raio_inicial = largura/2 - resto;
		
		function pixel_pos(x, y) {
			return (x * (largura * 4)) + (y * 4);
			
		}
		
		var jogo_w = quantas;
		var jogo_h = 20;
		var jogo = [];
		var jogo2 = [];
		var jogo_peca = [];
		
		var peca_caindo = false;
		var peca_caindo_pos = [];
		var peca_sombra = [];
		var n;
		var cor;
		var orientacao;
		var jogando = true;
		var intervalo;
		var giro = 0;
		/*				blue	   pink 	 green				*/
		var cores = ["#526e82", "#ec747d", "#41c0a9"];
		var lastCalledTime;
		var fps;
		var flag_highscore_updated = false;
		
		var mostra_fps = false;


		function pause() {
			if(jogando) {
				document.getElementById("pause").style.display = "block";
				clearInterval(intervalo);
				jogando = false;
			}
			else {
				document.getElementById("pause").style.display = "none";
				intervalo = setInterval(step, 300);
				jogando = true;
			}
		}

		function drawFPS() {

		  if(!lastCalledTime) {
		     lastCalledTime = new Date().getTime();
		     fps = 0;
		     return;
		  }
		  delta = (new Date().getTime() - lastCalledTime)/1000;
		  lastCalledTime = new Date().getTime();
		  fps = parseInt(1/delta, 10);

		  var fps_div = document.getElementById("fps");
		  fps_div.innerHTML = fps + " fps";
		}
		
		
		
		// atualiza canvas com a peça atualmente em movimento
		function desenha_canvas_peca() {
			var canvas = document.getElementById("peca");
			
			if(canvas.getContext) {
				var context = canvas.getContext("2d");
				context.clearRect(0, 0, largura, altura);
				
				
				// sombra
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_sombra[i].x;
					var y = peca_sombra[i].y;
					
					var bloco = cor;
					var lin = y;
				
					var raio = menor/8 + (grossura/2) + (jogo_h - lin - 1)*grossura;
				
					var rad_offset = (menor/8 + (grossura/2)) * 0.04 / raio;
					context.beginPath();
					context.strokeStyle = "#e2e2e2";
					context.lineWidth = grossura - 1.25;
					//context.arc(largura/2, altura/2, raio, Math.PI/2 - Math.PI/16 - x*tamanho, Math.PI/2 - Math.PI/16 - (x+1)*tamanho + rad_offset, true);
					context.arc(largura/2, altura/2, raio, -(Math.PI/2 - Math.PI/16 - (x+1)*tamanho + rad_offset), -(Math.PI/2 - Math.PI/16 - x*tamanho), true);
					
					// para o movimento ficar condizente com as setas sem precisar inverter a função delas, vamos desenhar ao contrário.
					// em vez de A a B, de -B a -A.
					context.stroke();
					context.closePath();	
				}
				
				// peca caindo atualmente
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_caindo_pos[i].x;
					var y = peca_caindo_pos[i].y;
					
					var bloco = cor;
					var lin = y;
				
					var raio = menor/8 + (grossura/2) + (jogo_h - lin - 1)*grossura;
				
					var rad_offset = (menor/8 + (grossura/2)) * 0.04 / raio;
					context.beginPath();
					context.strokeStyle = cores[bloco];
					context.lineWidth = grossura - 1.75;
					context.arc(largura/2, altura/2, raio, -(Math.PI/2 - Math.PI/16 - (x+1)*tamanho + rad_offset), -(Math.PI/2 - Math.PI/16 - x*tamanho), true);
					context.stroke();
					context.closePath();	
				}
			}
		}
		
		
		// atualiza canvas com as peças paradas
		function desenha_canvas() {
		
			var canvas = document.getElementById("canvas");
			
			if(canvas.getContext) {
				var context = canvas.getContext("2d");
				context.clearRect(0, 0, largura, altura);
				
				
				// circulo central
				context.beginPath();
				//arc(x, y, radius, startAngle, endAngle, anticlockwise);
				context.fillStyle = "white";
				context.arc(largura/2, altura/2, menor/8 - 1.75, 0, 2*Math.PI, true);
				context.fill();
				
				
				// pecas fixas
				for(var lin = jogo_h-1; lin >= 0; lin--) {
					for(var i = 0; i < quantas; i++) {
						var bloco = jogo[lin][i];
						if(bloco == '.') continue;
					
						var raio = menor/8 + (grossura/2) + (jogo_h - lin - 1)*grossura;
					
						var rad_offset = (menor/8 + (grossura/2)) * 0.04 / raio;
						context.beginPath();
						context.strokeStyle = cores[bloco];
						context.lineWidth = grossura - 1.25;
						context.arc(largura/2, altura/2, raio, -(Math.PI/2 - Math.PI/16 - (i+1)*tamanho), -(Math.PI/2 - Math.PI/16 - i*tamanho), true);
						context.stroke();
						context.closePath();
					}
				}
				
				
				
			}
		}
			

		
		function peca() {
			peca_caindo = true;
			n = Math.floor(Math.random()*7);
			cor = Math.floor(Math.random()*3);
			orientacao = Math.floor(Math.random()*2);
			giro = 0;
			
			switch(n) {
				//  *
				// ***
				case 0:
					peca_caindo_pos = [
						{x: jogo_w-3, y: 1},
						{x: jogo_w-2, y: 1},
						{x: jogo_w-1, y: 1},
						{x: jogo_w-2, y: 0}
					];
					break;
				// **
				// **
				case 1:
					peca_caindo_pos = [
						{x: jogo_w-2, y: 1},
						{x: jogo_w-1, y: 1},
						{x: jogo_w-2, y: 0},
						{x: jogo_w-1, y: 0}
					];
					break;
				//   *
				// ***
				case 2:
					peca_caindo_pos = [
						{x: jogo_w-3, y: 1},
						{x: jogo_w-2, y: 1},
						{x: jogo_w-1, y: 1},
						{x: jogo_w-1, y: 0}
					];
					break;
				// *
				// *
				// *
				// *
				case 3:
					peca_caindo_pos = [
						{x: jogo_w-1, y: 3},
						{x: jogo_w-1, y: 2},
						{x: jogo_w-1, y: 1},
						{x: jogo_w-1, y: 0}
					];
					break;
				// *
				// ***
				case 4:
					peca_caindo_pos = [
						{x: jogo_w-3, y: 1},
						{x: jogo_w-2, y: 1},
						{x: jogo_w-1, y: 1},
						{x: jogo_w-3, y: 0}
					];
					break;
				//  **
				// **
				case 5:
					peca_caindo_pos = [
						{x: jogo_w-3, y: 1},
						{x: jogo_w-2, y: 1},
						{x: jogo_w-2, y: 0},
						{x: jogo_w-1, y: 0}
					];
					break;
				// **
				//  **
				case 6:
					peca_caindo_pos = [
						{x: jogo_w-2, y: 1},
						{x: jogo_w-1, y: 1},
						{x: jogo_w-3, y: 0},
						{x: jogo_w-2, y: 0}
					];
					break;
			}
			if (orientacao == 0) 
			{
				 peca_caindo_pos[0].x -= quantas/2;
				 peca_caindo_pos[1].x -= quantas/2;
				 peca_caindo_pos[2].x -= quantas/2;
				 peca_caindo_pos[3].x -= quantas/2;
			}
			
			var giro_aleatorio = Math.floor(Math.random()*4);
			while(giro_aleatorio--) gira();
			
			desenha();
		}
		
		function desenha() {
			desenha_pontos();
			var t = document.getElementById("jogo");
			var html = '';
			
			
			for(var i = 0; i < jogo_h; i++) {
				for(var j = 0; j < jogo_w; j++) {
					jogo2[i][j] = jogo[i][j];
				}
			}

			sombra();

			for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_sombra[i].x;
					var y = peca_sombra[i].y;
					
					jogo2[y][x] = '\/';
			}
			
			for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_caindo_pos[i].x;
					var y = peca_caindo_pos[i].y;
					
					jogo2[y][x] = cor;
			}
			
			
			for(var i = 0; i < jogo_h; i++) {
				if(i < 4) html += "<span class='topo'>";
				for(var j = 0; j < jogo_w; j++) {
					html += jogo2[i][j];
				}
				if(i < 4) html += "</span>";
				html += '<br>';
			}
			
			t.innerHTML = html;
			
			desenha_canvas_peca();
		}


		function sombra() {

			var menor_y = []; // menor_y[i] é o y de menor altura (= maior número, já que cresce de cima pra baixo) dentre as peças que tem x igual a i.
	
			var diferentes_x = [];
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
		
				if(!menor_y[x]) menor_y[x] = y;
				else menor_y[x] = max(menor_y[x], y);
		
				if(diferentes_x.indexOf(x) == -1) diferentes_x.push(x);
			}
	
	
			var menor_variacao = jogo_h;
	
			for(var i = 0; i < diferentes_x.length; i++) {
				var x = diferentes_x[i];
				var y = menor_y[x];
		
		
				var v = 0; // variação
		
				while(y+v+1 < jogo_h && jogo[y+v+1][x] == '.')
					v++;
		
				menor_variacao = min(menor_variacao, v);
			}
	
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
				peca_sombra[i] = {x: x, y: y+menor_variacao};
			}
		}
		
		// Desenha a pontuação na tela em modo Jogo
		function desenha_pontos(){
			var pontos_div = document.getElementById("pontos");
			pontos_div.innerHTML = pontos + " pts";
		}

		function updateHighscore()
		{
			var HIGHSCORE_MAX_USERS = 10;
			highscores = JSON.parse(localStorage.getItem("highscores"));
			if (highscores == null)
			{
				if(pontos > 0) {
					//console.log("Highscores Zerados")
					var zero_highscore = [];
					zero_highscore.push({'name':get_name(),'score':pontos});
					localStorage.setItem('highscores',JSON.stringify(zero_highscore));
				}
			}
			else 
			{
				var i;
				for (i = 0; i <highscores.length;i++)
				{
					var score = highscores[i].score;
					if (pontos > score)
					{
						gameover_title.innerHTML = "Wow! Top 10!";
						highscores.splice(i,0,{'name':get_name(),'score':pontos});
						if ( i == 0)
							gameover_title.innerHTML = "New highscore!";
						break;
					}
				}
				
				if  (i == highscores.length && highscores.length < HIGHSCORE_MAX_USERS && pontos > 0)
				{
					highscores.splice(i,0,{'name':get_name(),'score':pontos});
					gameover_title.innerHTML = "Wow! Top 10!";
				}	
				if (highscores.length > HIGHSCORE_MAX_USERS)
					highscores.splice(10,highscores.length-HIGHSCORE_MAX_USERS);

				// Coloca o objeto que contém a lista de pontuações de novo na localStorage;
				localStorage.setItem('highscores',JSON.stringify(highscores));
			}
		}
		function get_name()
		{
			var player_name =  prompt("New highscore!\nPlease, enter your name:");
			if (player_name == null || player_name == "")
				player_name = "Player";
			return player_name;
		}
		function step() {			
		
			// Se acabou o jogo, exibe a tela de Gameover
			if(!jogando) {
				
				clearInterval(intervalo);
				pontos_final.innerHTML = pontos + " pts";
				if (pontos > 9000 && pontos < 10000)
					pontos_final.innerHTML = "It's Over " + pontos + "  pts!";		
				gameover.style.display = "block";

				if (!flag_highscore_updated)
				{
					updateHighscore();
					flag_highscore_updated = true;
				}


			}
			
			var pode = true;
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
				
				if(y+1 >= jogo_h || jogo[y+1][x] != '.') {
					pode = false;
					break;
				}
			}
			// Se puder aumenta o Y dela em 1 unidade ( fazendo ela ficar mais próxima do centro ).
			if(pode) {
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					y = peca_caindo_pos[i].y++;
				}
			}
			// Peca tocou em algo (para de cair)
			else {
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_caindo_pos[i].x;
					var y = peca_caindo_pos[i].y;
					if(y < 4) {
						jogando = false;
						pode = true;
					}
					jogo[y][x] = cor;
				}
				
				
				
				
				// checar linhas para ver se foram completadas
				var linhas = [];
				
				for(var i = 0; i < peca_caindo_pos.length; i++) {
				
					var linha = peca_caindo_pos[i].y;
					
					if(linhas.indexOf(linha) == -1)
						linhas.push(linha);
				}
				
				linhas.sort();
				
				var linhas_completas = [];
				
				for(var i = 0; i < linhas.length; i++) {
					var completa = true;
					
					for(var k = 0; k < jogo_w; k++) {
						if(jogo[linhas[i]][k] == '.') {
							completa = false;
							break;
						}
					}
					
					if(completa)
						linhas_completas.push(linhas[i]);
				}

				switch(linhas_completas.length) {
					case 1:
						pontos += 4*quantas*(level+1);
						break;
					case 2:
						pontos += 10*quantas*(level+1);
						break;
					case 3:
						pontos += 30*quantas*(level+1);
						break;
					case 4:
						pontos += 120*quantas*(level+1);
						break;
				}
				
				/*
					#dificuldade
					MECANICA PARA DIFICULTAR O NÍVEL DO JOGO 
					CONFORME A PONTUAÇÃO AUMENTA O INTERVALO DE TEMPO QUE AS PEÇAS DEMORAM PARA DESCER FICA MENOR.
				*/
				level = parseInt(pontos/1000);
				if (level > 20) level = 20; // O nível máximo é 18, entao se o nivel passar disso ele fica no 18.
				tempo_intervalo = 300 - (level)*10;
				window.clearInterval(intervalo);
				intervalo = window.setInterval(step, tempo_intervalo);
				

				for(var i = 0; i < linhas_completas.length; i++) {
					var linha = linhas_completas[i];
					
					for(var j = linha-1; j >= 0; j--) {
						for(var k = 0; k < jogo_w; k++) {
							jogo[j+1][k] = jogo[j][k];
						}
					}
				}
				
				desenha_canvas();
				
			}
			
			desenha();
			if(mostra_fps) drawFPS();
			
			if(!pode) peca();
			
			return pode;
		}
		
		function esquerda() {
			var pode = true;
			var novo_x;
	
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
		
				novo_x = ((x-1) + jogo_w) % jogo_w;
				
				if(jogo[y][novo_x] != '.') {
					pode = false;
					break;
				}
			}
			
			if(pode) {
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_caindo_pos[i].x;
		
					novo_x = ((x-1) + jogo_w) % jogo_w;
					peca_caindo_pos[i].x = novo_x;
				}
				desenha();
			}
		}
		
		function direita() {
			var pode = true;
			var novo_x;
	
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
		
				novo_x = (x+1) % jogo_w;
				
				if(jogo[y][novo_x] != '.') {
					pode = false;
					break;
				}
			}
			
			if(pode) {
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_caindo_pos[i].x;
		
					novo_x = (x+1) % jogo_w;
					peca_caindo_pos[i].x = novo_x;
				}
				desenha();
			}
		}
		
		function gira() {
			var peca_caindo_pos_new = [];
					
			var p = peca_caindo_pos;
			var pn = peca_caindo_pos_new;
			
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				peca_caindo_pos_new[i] = {x: p[i].x, y: p[i].y};
			}
			
			var pode = false;
			
			switch(n) {
				//  *
				// ***
				case 0:
					switch(giro) {
						case 0:
							pn[0] = {x: p[0].x + 2, y: p[0].y + 1};
							pn[1] = {x: p[1].x + 1, y: p[1].y};
							pn[2] = {x: p[2].x,     y: p[2].y - 1};
							pn[3] = {x: p[3].x,     y: p[3].y + 1};
							break;
						case 1:
							pn[0] = {x: p[0].x,     y: p[0].y - 2};
							pn[1] = {x: p[1].x - 1, y: p[1].y - 1};
							pn[2] = {x: p[2].x - 2, y: p[2].y};
							pn[3] = {x: p[3].x,     y: p[3].y};
							break;
						case 2:
							pn[0] = {x: p[0].x - 2, y: p[0].y};
							pn[1] = {x: p[1].x - 1, y: p[1].y + 1};
							pn[2] = {x: p[2].x,     y: p[2].y + 2};
							pn[3] = {x: p[3].x,     y: p[3].y};
							break;
						case 3:
							pn[0] = {x: p[0].x,     y: p[0].y + 1};
							pn[1] = {x: p[1].x + 1, y: p[1].y};
							pn[2] = {x: p[2].x + 2, y: p[2].y - 1};
							pn[3] = {x: p[3].x,     y: p[3].y - 1};
							break;
					}
					
					pode = true;
					break;
					
				// **
				// **
				case 1:
					break;
					
				//   *
				// ***
				case 2:
					switch(giro) {
						case 0:
							pn[0] = {x: p[0].x + 2, y: p[0].y + 1};
							pn[1] = {x: p[1].x + 1, y: p[1].y};
							pn[2] = {x: p[2].x,     y: p[2].y - 1};
							pn[3] = {x: p[3].x - 1, y: p[3].y};
							break;
						case 1:
							pn[0] = {x: p[0].x,     y: p[0].y - 2};
							pn[1] = {x: p[1].x - 1, y: p[1].y - 1};
							pn[2] = {x: p[2].x - 2, y: p[2].y};
							pn[3] = {x: p[3].x - 1, y: p[3].y + 1};
							break;
						case 2:
							pn[0] = {x: p[0].x - 2, y: p[0].y};
							pn[1] = {x: p[1].x - 1, y: p[1].y + 1};
							pn[2] = {x: p[2].x,     y: p[2].y + 2};
							pn[3] = {x: p[3].x + 1, y: p[3].y + 1};
							break;
						case 3:
							pn[0] = {x: p[0].x,     y: p[0].y + 1};
							pn[1] = {x: p[1].x + 1, y: p[1].y};
							pn[2] = {x: p[2].x + 2, y: p[2].y - 1};
							pn[3] = {x: p[3].x + 1, y: p[3].y - 2};
							break;
					}
					
					var pode = true;
					break;
					
				// *
				// *
				// *
				// *
				case 3:
					switch(giro) {
						case 0:
						case 2:
							pn[0] = {x: p[0].x + 2, y: p[0].y - 3};
							pn[1] = {x: p[1].x + 1, y: p[1].y - 2};
							pn[2] = {x: p[2].x,     y: p[2].y - 1};
							pn[3] = {x: p[3].x - 1, y: p[3].y};
							break;
						case 1:
						case 3:
							pn[0] = {x: p[0].x - 2, y: p[0].y + 3};
							pn[1] = {x: p[1].x - 1, y: p[1].y + 2};
							pn[2] = {x: p[2].x,     y: p[2].y + 1};
							pn[3] = {x: p[3].x + 1, y: p[3].y};
							break;
					}
					
					pode = true;
					break;
					
				// *
				// ***
				case 4:
					switch(giro) {
						case 0:
							pn[0] = {x: p[0].x + 2, y: p[0].y + 1};
							pn[1] = {x: p[1].x + 1, y: p[1].y};
							pn[2] = {x: p[2].x,     y: p[2].y - 1};
							pn[3] = {x: p[3].x + 1, y: p[3].y + 2};
							break;
						case 1:
							pn[0] = {x: p[0].x,     y: p[0].y - 2};
							pn[1] = {x: p[1].x - 1, y: p[1].y - 1};
							pn[2] = {x: p[2].x - 2, y: p[2].y};
							pn[3] = {x: p[3].x + 1, y: p[3].y - 1};
							break;
						case 2:
							pn[0] = {x: p[0].x - 2, y: p[0].y};
							pn[1] = {x: p[1].x - 1, y: p[1].y + 1};
							pn[2] = {x: p[2].x,     y: p[2].y + 2};
							pn[3] = {x: p[3].x - 1, y: p[3].y - 1};
							break;
						case 3:
							pn[0] = {x: p[0].x,     y: p[0].y + 1};
							pn[1] = {x: p[1].x + 1, y: p[1].y};
							pn[2] = {x: p[2].x + 2, y: p[2].y - 1};
							pn[3] = {x: p[3].x - 1, y: p[3].y};
							break;
					}
					
					var pode = true;
					break;
					
				//  **
				// **
				case 5:
					switch(giro) {
						case 0:
						case 2:
							pn[0] = {x: p[0].x + 2, y: p[0].y + 1};
							pn[1] = {x: p[1].x + 1, y: p[1].y};
							pn[2] = {x: p[2].x,     y: p[2].y + 1};
							pn[3] = {x: p[3].x - 1, y: p[3].y};
							break;
						case 1:
						case 3:
							pn[0] = {x: p[0].x - 2, y: p[0].y - 1};
							pn[1] = {x: p[1].x - 1, y: p[1].y};
							pn[2] = {x: p[2].x,     y: p[2].y - 1};
							pn[3] = {x: p[3].x + 1, y: p[3].y};
							break;
					}
					
					var pode = true;
					break;
					
				// **
				//  **
				case 6:
					switch(giro) {
						case 0:
						case 2:
							pn[0] = {x: p[0].x,     y: p[0].y};
							pn[1] = {x: p[1].x - 1, y: p[1].y - 1};
							pn[2] = {x: p[2].x,     y: p[2].y + 2};
							pn[3] = {x: p[3].x - 1, y: p[3].y + 1};
							break;
						case 1:
						case 3:
							pn[0] = {x: p[0].x,     y: p[0].y};
							pn[1] = {x: p[1].x + 1, y: p[1].y + 1};
							pn[2] = {x: p[2].x,     y: p[2].y - 2};
							pn[3] = {x: p[3].x + 1, y: p[3].y - 1};
							break;
					}
					
					var pode = true;
					break;
			}
			
			pn[0].x = (pn[0].x + jogo_w) % jogo_w;
			pn[1].x = (pn[1].x + jogo_w) % jogo_w;
			pn[2].x = (pn[2].x + jogo_w) % jogo_w;
			pn[3].x = (pn[3].x + jogo_w) % jogo_w;
			
			if(pode) {
				for(var i = 0; i < pn.length; i++) {
					var x = pn[i].x;
					var y = pn[i].y;

					if(y >= jogo_h || jogo[y][x] != '.') {
						pode = false;
						break;
					}
				}
			}
			
			if(pode) {
				for(var i = 0; i < pn.length; i++) {
					p[i].x = pn[i].x;
					p[i].y = pn[i].y;
				}
				giro++;
				giro %= 4;
				
				desenha();
			}
		}
		
		function primeiro_clique() {
			document.querySelector("#dir span").style.opacity = 0;
			document.querySelector("#esq span").style.opacity = 0;
			clicou = true;
		}
		
		var touch_interval_ids = {"esq": -1, "dir": -1, "peca": -1};
		var touch_action_delay = 150;
		var touch_action_delay_step = 50;
		
		//interface para traducao de touches para movimentos
		//usa de timers (setInterval) para continuar a mover
		//as pecas ate que o botao seja solto
		function touch_interface(e) {
			if(jogando) {
				//limpa os timers no inicio e final de touches
				if(touch_interval_ids[e.currentTarget.id] != -1){ 
					window.clearInterval(touch_interval_ids[e.currentTarget.id]);
					touch_interval_ids[e.currentTarget.id] = -1;
				}
			
				//se for o comeco de um touch, inicia e cadastra o id do timer e move
				if(e.type == "touchstart"){
					switch(e.currentTarget.id){
					case "esq":
						esquerda();
						touch_interval_ids["esq"] = window.setInterval(esquerda, touch_action_delay);
						//no primeiro touch, faz as teclas sumirem
						//if (!clicou)
						//	primeiro_clique();
						break;
					case "dir":
						direita();
						touch_interval_ids["dir"] = window.setInterval(direita, touch_action_delay);
						//no primeiro touch, faz as teclas sumirem
						//if (!clicou)
						//	primeiro_clique();
						break;
					case "peca":
						//descer a peca enquanto "step" retornar true (peca nao colidir)
						//while(step()); Hard drop desativado.
						step();
						touch_interval_ids["peca"] = window.setInterval(step, touch_action_delay_step);
						break;
					}
				}
			}
		}
		
		var clicou = false;
		
		/*
			"SETUP" DO JOGO
		*/

		// Inicializa os arrays c as configuracao do jogo.
		for(var i = 0; i < jogo_h; i++) {
			jogo[i] = [];
			jogo2[i] = [];
			jogo_peca[i] = [];
			
			for(var j = 0; j < jogo_w; j++) { 
				jogo[i][j] = '.';
				jogo2[i][j] = '.';
				jogo_peca[i][j] = '.';
			}
		}
		
		document.addEventListener("DOMContentLoaded", function() {
			

			// Teclado
			document.addEventListener("keypress", function(e) {
			
				// espaço
				if(e.keyCode == 0 && e.charCode == 32) pause();
				
				if(jogando) {
					// direita
					if(e.keyCode == 39) direita();
				
					// esquerda
					else if(e.keyCode == 37) esquerda();
				
					// cima
					else if(e.keyCode == 38) gira();
				
					// baixo
					else if(e.keyCode == 40) step();
					
					// enter
					else if (e.keyCode == 13) pontos += 500;
					
					// backspace
					else if (e.keyCode == 8) jogando = false;
				}
			}, false);
			
			var canvas = document.getElementById("canvas");
			var canvas_peca = document.getElementById("peca");
			
			gameover = document.getElementById("gameover");
			gameover_title = document.getElementById("gameover-title");
			pontos_final = document.getElementById("gameover-score");
			highscore_name = document.getElementById("highscore-name");
				
				
			canvas.width = largura;
			canvas.height = altura;
			
			canvas_peca.width = largura;
			canvas_peca.height = altura;
			
			// Botões de controle do jogo
			document.getElementById("esq").addEventListener("touchstart", touch_interface, false);
			document.getElementById("dir").addEventListener("touchstart", touch_interface, false);
			document.getElementById("peca").addEventListener("touchstart", touch_interface, false);

			document.getElementById("esq").addEventListener("touchend", touch_interface, false);
			document.getElementById("dir").addEventListener("touchend", touch_interface, false);
			document.getElementById("peca").addEventListener("touchend", touch_interface, false);
			
			
			// Botões de interação com o usuário
			document.getElementById("meio").addEventListener("click", gira, false);
			document.getElementById("pause-botao").addEventListener("click", pause, false);
			document.getElementById("resume").addEventListener("click", pause, false);
			

			if(!mostra_fps) document.getElementById("fps").style.display = "none";
			
			jogando = true;
			peca();
			desenha_canvas();
			desenha();
			
			// Define o intervalo inicial em 300ms
			intervalo = window.setInterval(step, 300);
		});
