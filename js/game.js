		var largura_total = window.innerWidth;
		var altura_total = window.innerHeight;
	
		
		var touch;
		var touch_context;
		var last_pt = null;
		
		var largura = largura_total;
		var altura_touch = parseInt(altura_total / 10, 10);
		var altura = altura_total - altura_touch;
		
		function min(a, b) { return a < b ? a : b; }
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
		
		
		function min(a, b) { return a < b ? a : b; }
		function max(a, b) { return a > b ? a : b; }

		var jogo_w = quantas;
		var jogo_h = 20;
		var jogo = [];
		var jogo2 = [];
		var jogo_peca = [];
		
		var peca_caindo = false;
		var peca_caindo_pos = [];
		var peca_feedback = [];
		var n;
		var cor;
		var orientacao;
		var jogando = true;
		var intervalo;
		var giro = 0;
		var cores = ["#5a5858", "#ec747d", "#41c0a9"];

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
						context.arc(largura/2, altura/2, raio, Math.PI/2 - Math.PI/16- i*tamanho, Math.PI/2 - Math.PI/16- (i+1)*tamanho , true);
						context.stroke();
					}
				}
				
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_feedback[i].x;
					var y = peca_feedback[i].y;
					
					var bloco = cor;
					var lin = y;
				
					var raio = menor/8 + (grossura/2) + (jogo_h - lin - 1)*grossura;
				
					var rad_offset = (menor/8 + (grossura/2)) * 0.04 / raio;
					context.beginPath();
					context.strokeStyle = "#e2e2e2";
					context.lineWidth = grossura - 1.25;
					context.arc(largura/2, altura/2, raio, Math.PI/2 - Math.PI/16- x*tamanho, Math.PI/2 - Math.PI/16- (x+1)*tamanho + rad_offset, true);
					context.stroke();
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
					context.arc(largura/2, altura/2, raio, Math.PI/2 - Math.PI/16 - x*tamanho, Math.PI/2 - Math.PI/16 - (x+1)*tamanho + rad_offset, true);
					context.stroke();
				}
				
			}
		}
		
		
		
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
		
		function peca() {
			peca_caindo = true;
			n = Math.floor(Math.random()*4);
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
			}
			if (orientacao == 0) 
			{
				 peca_caindo_pos[0].x -= quantas/2;
				 peca_caindo_pos[1].x -= quantas/2;
				 peca_caindo_pos[2].x -= quantas/2;
				 peca_caindo_pos[3].x -= quantas/2;
			}
			
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

			feedback();

			for(var i = 0; i < peca_caindo_pos.length; i++) {
					var x = peca_feedback[i].x;
					var y = peca_feedback[i].y;
					
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
			
			desenha_canvas();
		}
		
		
		function feedback() {
			var y_baixo = 0;
			
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
				
				y_baixo = max(y_baixo, y);
			}
			
			
			var y_feedback = jogo_h-1;
			
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
				
				var y_min = y;
				if(y == y_baixo) {
					while(y_min+1 < jogo_h && jogo[y_min+1][x] == '.') y_min++;
					y_feedback = min(y_feedback, y_min);
					//alert("y_min = " + y_min);
				}
				
			}
			
			//alert("y_baixo = " + y_baixo + ", y_feedback = " + y_feedback);
			
			var dif = y_feedback - y_baixo;
			
			//alert("dif = " + dif);
			
			for(var i = 0; i < peca_caindo_pos.length; i++) {
				var x = peca_caindo_pos[i].x;
				var y = peca_caindo_pos[i].y;
				//console.log("pus o " + i);
				peca_feedback[i] = {x: x, y: y+dif};
			}
			
		}
		function desenha_pontos()
		{
			var pontos_div = document.getElementById("pontos");
			pontos_div.innerHTML = pontos + " pts";
		}
		
		function step() {
			
			
			if(!jogando) {
				clearInterval(intervalo);
				gameover = document.getElementById("gameover");
				pontos_final = document.getElementById("gameover-score");
				pontos_final.innerHTML = pontos + " pts";
				gameover.style.display = "block";

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
			
			if(pode) {
				for(var i = 0; i < peca_caindo_pos.length; i++) {
					y = peca_caindo_pos[i].y++;
				}
			}
			// peca tocou em algo (para de cair)
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
				
				
				for(var i = 0; i < linhas_completas.length; i++) {
					var linha = linhas_completas[i];
					
					for(var j = linha-1; j >= 0; j--) {
						for(var k = 0; k < jogo_w; k++) {
							jogo[j+1][k] = jogo[j][k];
						}
					}
				}
				
			}
			
			desenha();
			
			if(!pode) peca();
		}
		
		function esquerda(e) {
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
		
		function direita(e) {
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
		
		function gira(e) {
			e.preventDefault();
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
			document.getElementById("dir").style.background = "white";
			document.getElementById("esq").style.background = "white";
			clicou = true;
		}
		
		function esquerda2(e) {
			e.preventDefault();
			if(!clicou) primeiro_clique();
			esquerda();
		}
		
		function direita2(e) {
			e.preventDefault();
			if(!clicou) primeiro_clique();
			direita();
		}
		
		function meio2(e) {
			e.preventDefault();
			if(!clicou) primeiro_clique();
			gira();
		}
		
		var clicou = false;
		
		document.addEventListener("DOMContentLoaded", function() {
			document.addEventListener("keypress", function(e) {
			
				// esquerda
				if(e.keyCode == 39) {
					esquerda();
				}
				
				// direita
				else if(e.keyCode == 37) {
					direita();
				}
				
				// cima
				else if(e.keyCode == 38) {
					gira();
					
				}
				else if(e.keyCode == 40) {
					step();
				}
				
			}, false);
			
			var canvas = document.getElementById("canvas");
			canvas.width = largura;
			canvas.height = altura;
			
			
			document.getElementById("esq").addEventListener("click", direita2);
			document.getElementById("dir").addEventListener("click", esquerda2);
			document.getElementById("meio").addEventListener("click", meio2);
			canvas.addEventListener("click", gira);
			
			jogando = true;
			peca();
			desenha();
			intervalo = setInterval(step, 300);
		
			
			var esq = document.getElementById("esq");
			var dir = document.getElementById("dir");
			esq.style.height = altura_touch + "px";
			dir.style.height = altura_touch + "px";
			
		});
