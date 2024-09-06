import { keyPress, key } from "./keyboard";
import { loadAudio } from "./loaderAssets";

import Hero from "./Hero";
import Ball from "./Ball";
import Support from "./Support";
import Score from "./Score";

window.start = false;

// Variáveis de contexto e canvas
let CTX;
let CANVAS;
CANVAS = document.getElementById('gameCanvas');
const FRAMES = 60;

const qtdBalls = 3;
let balls = Array.from({ length: qtdBalls });

// Instanciação das classes principais do jogo
const hero = new Hero(310, 60, 15, 2, 20, 20, 'img/preparer.png', FRAMES);
const support = new Support(15, 20, 20, 'img/support-water.png', CANVAS.width, CANVAS.height);
const score = new Score();

// Variáveis para os sons do jogo
let SoundLoading = null;
let SoundCollectingSupport = null;
let SoundGameOver = null;

let gameover = false;
let anime;
let boundaries;

// Função de inicialização do jogo
const init = async () => {
    CANVAS = document.getElementById('gameCanvas');
    CTX = CANVAS.getContext('2d');

    boundaries = {
        width: CANVAS.width,
        height: CANVAS.height
    };

    // Cria as bolas no jogo 
    balls = balls.map(() =>
        new Ball(
            CANVAS.width - 5,
            Math.random() * CANVAS.height,
            10, 3, 'img/ball-game.png'
        )
    );

    // Carrega o áudio de carregamento do jogo
    try {
        SoundLoading = await loadAudio('sounds/game-loading.mp3');
        if (SoundLoading?.volume) {
            SoundLoading.volume = .2;
        } else {
            throw new Error('Erro ao carregar o som de carregamento');
        }
    } catch (error) {
        console.error(error);
    }

    // Carrega o áudio de coleta do suporte
    try {
        SoundCollectingSupport = await loadAudio('sounds/game-collect.mp3');
        if (SoundCollectingSupport?.volume) {
            SoundCollectingSupport.volume = .2;
        } else {
            throw new Error('Erro ao carregar o som de carregamento');
        }
    } catch (error) {
        console.error(error);
    }

    // Carrega o áudio de game over
    try {
        SoundGameOver = await loadAudio('sounds/game-over.mp3');
        if (SoundGameOver?.volume) {
            SoundGameOver.volume = .2;
        } else {
            throw new Error('Erro ao carregar o som de game over');
        }
    } catch (error) {
        console.error(error);
    }

    keyPress(window);

    // Toca o som de carregamento se estiver disponível
    if (SoundLoading) {
        SoundLoading.play();
    }

    // Adiciona um listener para iniciar o jogo ao pressionar a tecla 'Space'
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !window.start) {
            window.start = true;
            document.getElementById('loading-screen').style.display = 'none'; // Remove tela de carregamento

            if (SoundLoading) {
                SoundLoading.pause();
                SoundLoading.currentTime = 0;
            }
            loop();
        }
    });

    document.getElementById('loading-screen').style.display = 'flex'; // Mostra a tela de carregamento
};

// Função principal do loop do jogo
const loop = () => {
    setTimeout(() => {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height); // Limpa o canvas a cada frame

        if (window.start) {
            // Desenha o herói
            hero.draw(CTX);
            hero.move(boundaries, key);

            // Desenha o suporte de água
            support.draw(CTX);

            balls.forEach(b => {
                b.move(boundaries);
                b.draw(CTX);

                gameover = !gameover ? hero.colide(b) : true;
            });

            const scoring = hero.colide(support);

            // Atualiza o placar e reposiciona o suporte em caso de colisão
            if (scoring) {
                score.increment();
                support.updatePosition(CANVAS.width, CANVAS.height);
                score.update();
                SoundCollectingSupport.play();
            }

            // Verifica condição de game over
            if (gameover) {
                SoundGameOver.play();
                cancelAnimationFrame(anime);
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                anime = requestAnimationFrame(loop);
            }
        } else {
            anime = requestAnimationFrame(loop);
        }
    }, 1000 / FRAMES);
};

export { init };