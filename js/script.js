var gameStatus = false;
var highest;
var pontos = 0;
var cron;
var superman = true;

const pipe = document.querySelector(".pipe");
const mario = document.querySelector(".mario");
const menu = document.querySelector(".menu");
const informacaoRecorde = document.querySelector(".record");
const chao = document.getElementById("chao");
const montains = document.getElementById("montains");

const clouds = document.getElementById("clouds");

doSomething();
    async function sleep(time) {
        await new Promise(resolve => setTimeout(resolve, time))
      }
      async function doSomething() {
        while ((true)) {
            console.log("aa")
            clouds.style.top = getRandomArbitrary(10, 15)+'vw';
            clouds.style.width = getRandomArbitrary(15, 40)+'vh';
                await sleep(1000000);
        }
      }

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function jump() {
    mario.classList.add("jump");

    setTimeout(() => {
        mario.classList.remove("jump");
    },500); 
}

function duck() {
    mario.classList.add("duck");
}

function death() {
    mario.classList.add("death");

    if(document.querySelector(".creditos").style.display != "block") {
        document.querySelector(".menu").style.display = "block";
    };
    
    pipe.style.animation = "none";
    gameStatus = false;
    contadorPause();
}

window.onload = function() {
    if(localStorage.getItem("recorde") != undefined) {
        highest = parseInt(localStorage.getItem("recorde"));
    }
    document.querySelector(".record").innerHTML = "Ultimo recorde: "+highest;
}

function compartilhar(){
	if (navigator.share !== undefined) {
		navigator.share({
			title: 'Mario running from Brazil',
			text: `Acabei de jogar e amei! Meu recorde foi ${highest}. Achas que tens o que é preciso para esmagares meu recorde? Clica aqui.`,
			url: 'https://arttturslv.github.io/mario-runner/',
		})
		.then(() => console.log('Successful share'))
		.catch((error) => console.log('Error sharing', error));
	}
}

function toggleCreditos(name) {
    div = document.querySelector(name);

    if(div.style.display != "block"){ //se estiver fechada, abre
        div.style.display = "block";

        mario.src = "./assets/mario-happy.gif";
        mario.style.width = '8.5%';
        mario.style.bottom = '35px'; 
        console.log("clicado")
        document.querySelector(".menu").style.display = "none"; //fecha o menu
    } else { 
        div.style.display = "none"; //esconde os creditos

        mario.src = "./assets/mario.gif";
        mario.style.width = '15%';
        mario.style.bottom = `50px`;
        document.querySelector(".menu").style.display = "block";  //abre o menu
    }
}

function pontuacao() {
    if(gameStatus) {
        cron = setInterval(() => { contadorPontos(); }, 1000);
    } 
}

function contadorPontos() {
    pontos++; 
    informacaoRecorde.innerHTML = "Nova tentativa: "+pontos;
    return pontos;
}

function contadorPause() {
    clearInterval(cron);

    if(pontos>highest) {
        highest = pontos;
        localStorage.setItem("recorde", (""+highest));
    }
    informacaoRecorde.innerHTML = "Ultimo recorde: "+highest;
    pontos=0;
}

function startGame() {
    gameStatus = true;

    mario.classList.remove("death");
    pipe.style.removeProperty('left');
    pipe.style.animation = "pipe-animation 2s linear infinite";
    chao.style.animation = "slide 70s linear infinite";
    montains.style.animation = "slide 200s linear infinite";

    menu.style.display = "none";
    mario.src = "./assets/mario.gif";
    mario.style.width = '15%';
    mario.style.bottom = `50px`;
    
    pontuacao();
    loop();
}



function pixelsToPercentage(pixel) {
    return (pixel / window.innerWidth) * 100;
  }
  
function loop() {
    setInterval(() => {
        const pipePositionpx = pipe.offsetLeft;
        const marioPositionBottom = +window.getComputedStyle(mario).bottom.replace('px',''); //apaga o px para retornar apenas o valor. O '+' converte em numero
        console.log(pixelsToPercentage(170));

        if (pipePositionpx <= pixelsToPercentage(170) && pipePositionpx > 0 && marioPositionBottom < 90 &&superman) { //se o tubo chegou a encostar no mario e o tubo ainda nao passou por ele e o mario nao tenha altura, o jogo para.
            pipe.style.animation = 'none';
            chao.style.animation = "none";
            montains.style.animation = "none";

            pipe.style.left = `${pipePositionpx}px`;

            mario.style.bottom = `${marioPositionBottom}px`;
            mario.src = "./assets/game-over.png";
            mario.style.width = '5%';
            // mario.style.marginLeft = '60px';
            
            death();
            clearInterval(loop);
        }
    },10);
}

document.addEventListener('keydown', press);
function press(e) {
    if(e.keyCode === 40 || e.keyCode === 83  && gameStatus) {
        mario.src = "./assets/mario-duck.gif";
        mario.style.width = '8.5%';
        duck();
    } else {
        jump();
    }
}

document.addEventListener('keyup', release);
function release(e){
    if(e.keyCode === 40 || e.keyCode === 83 && gameStatus) {
        mario.src = "./assets/mario.gif";
        mario.style.width = '15%';
        mario.classList.remove("duck");
  } else if (e.keyCode ===40 || e.keyCode===83 && gameStatus == false) {
    mario.src = "./assets/game-over.png";
    mario.style.width = '15%';
    // mario.style.marginLeft = '60px';
  }
}



/*
const secretSequence = ['j', 'u', 'm', 'p', 'j', 'e', 't'];
let currentSequenceIndex = 0;

document.addEventListener('keydown', (event) => {
    if (event.key === secretSequence[currentSequenceIndex]) {
      currentSequenceIndex++;
        console.log(event.key);
      if (currentSequenceIndex === secretSequence.length) {
        activateInvincibilityMode();
        currentSequenceIndex = 0; // Reinicia o índice
      }
    } else {
        console.log(event.key);

      currentSequenceIndex = 0; // Reinicia se a tecla errada for pressionada
    }
  });
  
  function activateInvincibilityMode() {
    superman = false;
    // Ative o modo invencível aqui
    console.log('Modo invencível ativado!');
    mario.src="./assets/JUMPJET.gif"
    console.log("clicado")

  }


 no desktop display, ele passa por 4 pipes até morrer no quinto, provavelmente é da conta*/