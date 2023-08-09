var gameStatus = false;


const mario = document.querySelector(".mario");

const jump = () => {
    mario.classList.add("jump");

    setTimeout(() => {
        mario.classList.remove("jump");
    },500); 
}

//document.addEventListener('keydown', jump);

const pipe = document.querySelector(".pipe");

function loop() {

 setInterval(() => {
    if(gameStatus == true) {

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px',''); //apaga o px para retornar apenas o valor. O '+' converte em numero

    if (pipePosition <= 170 && pipePosition > 0 && marioPosition < 50) { //se o tubo chegou a encostar no mario e o tubo ainda nao passou por ele e o mario nao tenha altura, o jogo para.
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.bottom = `${marioPosition}px`;

        mario.src = "./assets/game-over.png";
        mario.style.width = '90px';
        mario.style.marginLeft = '60px';
        death();


        clearInterval(loop);
    }
}

},10);
 }

const death = () => {
    mario.classList.add("death");
    document.querySelector(".menu").style.display = "block";
    pipe.style.animation = "none";
    gameStatus = false;
    stopScore();
}


function toggle(name) {
    div = document.querySelector(name);


    if(div.style.display == "none"){
        div.style.display = "block";
        mario.src = "./assets/mario-happy.gif";
        mario.style.width = '180px';
        mario.style.bottom = '-25px';

        document.querySelector(".menu").style.display = "none";


    } else {
        document.querySelector(".menu").style.display = "block";

        div.style.display = "none";
        mario.src = "./assets/mario.gif";
        mario.style.width = '200px';
        mario.style.bottom = `0px`;

    }
}

function start() {
    gameStatus = true;

    mario.classList.remove("death");

    pipe.style.removeProperty('left');
    score();
    document.querySelector(".menu").style.display = "none";
    mario.src = "./assets/mario.gif";
    mario.style.width = '200px';
    mario.style.bottom = `0px`;

    pipe.style.removeProperty("left");
    pipe.style.animation = "pipe-animation 2s linear infinite";

    loop();

}

var highest;
window.onload =  function() {

    highest = parseInt(localStorage.getItem("recorde"));

    if(highest == NaN) {
        highest = 0;
    }

    document.getElementById("sad").innerHTML = "Ultimo recorde: "+highest;

}


var pontos = 0;
var cron;

function stopScore() {
    clearInterval(cron);
    if(pontos>highest) {
        highest = pontos;
        localStorage.setItem("recorde", (""+highest));
    }
    document.getElementById("sad").innerHTML = "Ultimo recorde: "+highest;
    
    pontos=0;
}

function timer() {
    pontos++; //Incrementa +1 na variável ss

    //Insere o valor tratado no elemento counter
    document.getElementById("sad").innerHTML = "Nova tentativa: "+pontos;

    //Retorna o valor tratado
    return pontos;
}


function score() {
    if(gameStatus) {
        console.log(gameStatus);
        cron = setInterval(() => { timer(); }, 1000);
    } 
}



function share(){
	if (navigator.share !== undefined) {
		navigator.share({
			title: 'Mario running from Brazil',
			text: `Acabei de jogar e amei! Meu recorde foi ${highest}. Achas que tens o que é preciso para esmagares meu recorde? Clica aqui.`,
			url: 'https://seusite.com/sua_url',
		})
		.then(() => console.log('Successful share'))
		.catch((error) => console.log('Error sharing', error));
	}
}



document.addEventListener('keydown', press);

function press(e) {
    if(e.keyCode ===40 || e.keyCode===83  && gameStatuss) {
        mario.src = "./assets/mario-duck.gif";
        mario.style.width = '150px';
        duck();

    } else {
        jump();
    }
}

document.addEventListener('keyup',release);
function release(e){
    if(e.keyCode ===40 || e.keyCode===83 && gameStatus) {
        mario.src = "./assets/mario.gif";
        mario.style.width = '200px';
        mario.classList.remove("duck");
  } else if (e.keyCode ===40 || e.keyCode===83 && gameStatus == false) {
    mario.src = "./assets/game-over.png";
    mario.style.width = '90px';
    mario.style.marginLeft = '60px';
  }
}

const duck = () => {
    console.log("adc")
    mario.classList.add("duck");

}


