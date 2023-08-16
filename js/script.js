var gameStatus = false;
var maiorRecorde;
var pontos = 0;
var cron;
var invencibilidade = false;
var tempoJogado = 0;
var ducking = false;
let iteradorMacete = 0;

const pipe = document.querySelector(".pipe");
const mario = document.querySelector(".mario");
const menu = document.querySelector(".menu");
const informacaoRecorde = document.querySelector(".recorde");
const ground = document.getElementById("ground");
const montains = document.getElementById("montains");
const bullet = document.querySelector(".bullet");
const jet = document.querySelector(".jet");
const botaoUp = document.querySelector(".botao-up");
const botaoDown = document.querySelector(".botao-down");
const clouds = document.getElementById("clouds");
const macete = ['j', 'u', 'm', 'p', 'j', 'e', 't'];

controlaNuvens();
window.onload = novoRecorde ();


function iniciarJogo() {
    gameStatus = true;
    incrementaVelocidadeJogo();

    mario.classList.remove("death");
    pipe.style.removeProperty('left');

    menu.style.display = "none";
    normalMario()

    pontuacao();
    loop();
}


async function incrementaVelocidadeJogo() {
    while (gameStatus) {
        if (tempoJogado < 7.5) {
            tempoJogado += 0.005;
        }
        controlaAnimacao(tempoJogado);
        await cooldown(100);
    }
}
function controlaAnimacao(tempoJogado) {
    pipe.style.animation = `pipe-animation ${calculaVelocidade(4, 10, tempoJogado)}s linear infinite`;
    ground.style.animation = `slide ${calculaVelocidade(70, 10, tempoJogado)}s linear infinite`;
    montains.style.animation = `slide ${calculaVelocidade(200, 10, tempoJogado)}s linear infinite`;
    
    let random = Math.floor(Math.random() * 20);
    if (random % 2 == 0 && random % 4 == 0) {
        bullet.style.animation = `bullet-animation ${calculaVelocidade(4, 10, tempoJogado)}s infinite linear`;
    }
}
async function controlaNuvens() {
    while ((true)) {
        clouds.style.top = numeroAleatorio(10, 15) + 'vw';
        clouds.style.width = numeroAleatorio(15, 40) + 'vh';
        await cooldown(100000);
    }
}

async function cooldown(time) {
    await new Promise(resolve => setTimeout(resolve, time))
}
function numeroAleatorio(min, max) {
    return Math.random() * (max - min) + min;
}
function calculaVelocidade(velocidadeAnimacao, dificuldade, tempoJogado) {
    return velocidadeAnimacao - (velocidadeAnimacao / (dificuldade - tempoJogado));
}


/* Ações do mario */
function jump() {
    mario.classList.add("jump");

    setTimeout(() => {
        mario.classList.remove("jump");
    }, 500);
}
function duck() {
    mario.src = "./assets/mario-duck.gif";
    mario.style.width = '8.5%';
    mario.classList.add("duck");
    ducking = true;
}
function death() {
    mario.src = "./assets/game-over.png";
    mario.style.width = '5%';
    mario.classList.add("death");
    tempoJogado = 0;
    if (document.querySelector(".informacao-creditos").style.display != "block") {
        document.querySelector(".menu").style.display = "block";
    };

    pipe.style.animation = "none";
    gameStatus = false;
    contadorPause();
}
function normalMario() {
    mario.src = "./assets/mario.gif";
    mario.style.width = '15%';
    mario.style.bottom = `50px`;
    mario.classList.remove("duck");

}

function novoRecorde() {
    if (localStorage.getItem("recorde") == undefined) {
        console.log(localStorage.getItem("recorde"));
        maiorRecorde = 0;
    } else {
        maiorRecorde = parseInt(localStorage.getItem("recorde"));
    }
    console.log("O recorde anterior foi de: "+maiorRecorde)
    document.querySelector(".recorde").innerHTML = "Ultimo Recorde: " + maiorRecorde;
}
function compartilhar() {
    if (navigator.share !== undefined) {
        navigator.share({
            title: 'Mario running from Brazil',
            text: `Acabei de jogar e amei! Meu Recorde
         foi ${maiorRecorde
                }. Clique aqui para jogar.`,
            url: 'https://arttturslv.github.io/mario-runner/',
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    }
}

function toggleInformacao(name) {
    div = document.querySelector(name);

    if (div.style.display != "block") { //se estiver fechada, abre
        div.style.display = "block";

        mario.src = "./assets/mario-happy.gif";
        mario.style.width = '8.5%';
        mario.style.bottom = `5%`;
        mario.style.zIndex = `50541`;
        console.log("clicado")
        document.querySelector(".menu").style.display = "none"; //fecha o menu
    } else {
        div.style.display = "none"; //esconde os creditos

        normalMario();
        document.querySelector(".menu").style.display = "block";  //abre o menu
    }
}

function pontuacao() {
    if (gameStatus) {
        cron = setInterval(() => { contadorPontos(); }, 1000);
    } 
}

function contadorPontos() {
    pontos++;
    informacaoRecorde.innerHTML = "Nova tentativa: " + pontos;
    return pontos;
}

function contadorPause() {
    clearInterval(cron);

    if (pontos > maiorRecorde) {
        maiorRecorde
            = pontos;
        localStorage.setItem("recorde", ("" + maiorRecorde
        ));
    }
    informacaoRecorde.innerHTML = "Ultimo Recorde: " + maiorRecorde;
    pontos = 0;
}


function pixelParaPorcentagem(pixel) {
    return (pixel / window.innerWidth) * 100;
}

function loop() {
    setInterval(() => {
        const pipePositionpx = pipe.offsetLeft;
        const marioPositionBottom = +window.getComputedStyle(mario).bottom.replace('px', ''); //apaga o px para retornar apenas o valor. O '+' converte em numero
        const bulletPositionpx = bullet.offsetLeft;

        if ((((bulletPositionpx <= pixelParaPorcentagem(170) && bulletPositionpx > 0) && ducking == false) || (pipePositionpx <= pixelParaPorcentagem(160) && pipePositionpx > 0 && marioPositionBottom < 90)) && invencibilidade == false) { //se o tubo chegou a encostar no mario e o tubo ainda nao passou por ele e o mario nao tenha altura, o jogo para.
            pipe.style.animation = 'none';
            ground.style.animation = "none";
            montains.style.animation = "none";
            bullet.style.animation = "none";

            pipe.style.left = `${pipePositionpx}px`;

            mario.style.bottom = `${marioPositionBottom}px`;


            death();
            clearInterval(loop);
        }
    }, 10);
}

/* INVENCIBILIDADE */
function ativarInvencibilidade() {
    console.log("Macete ativado! Para desativar, recarregue a pagina.")
    console.log("Pontos feitos não serão contabilizados.")
    invencibilidade = true;
    jet.style.display = "block";
    mario.style.display = "none";
}

/* CONTROLES */
botaoDown.addEventListener('mouseup', function() {
    normalMario();
    ducking = false;

});

botaoDown.addEventListener('mousedown', function() {
    iteradorMacete=0;
    duck();
});

botaoDown.addEventListener('touchstart', function() {
    iteradorMacete=0;
    duck();
});
//era mousedown
botaoUp.addEventListener('touchstart', function() {
    jump();
});

botaoUp.addEventListener('touchcancel', function() {
    soltarTecla();
});

/*teclado*/

document.addEventListener('keydown', apertarTecla);
document.addEventListener('keyup', soltarTecla);

function apertarTecla(e) {
    if(gameStatus==false & e.key === macete[iteradorMacete]) {
        iteradorMacete++;
        if (iteradorMacete === macete.length) {
            ativarInvencibilidade();
            i = 0; // Reinicia o índice
        }
    } else if (e.key === 's' || e.key === 'ArrowDown' && gameStatus) {
        iteradorMacete=0;
        duck();
    } else {
        iteradorMacete=0;
        jump();
    }
}

function soltarTecla(e) {
    ducking = false;
    if (e.key === 's' || e.key === 'ArrowDown' && gameStatus) {
        normalMario();
    } 
}
