import { keyPress, key } from "./keyboard";
import { loadAudio } from "./loaderAssets";

import Hero from "./Hero";
import Ball from "./Ball";
import Support from "./Support";
import Score from "./Score";

window.start = false;
let CTX;
let CANVAS;
const FRAMES = 60;

const qtdBalls = 1;
let balls = Array.from({ length: qtdBalls });

const hero = new Hero(310, 40, 15, 2, 20, 20, '../../img/preparer.png', FRAMES);
const support = new Support(15, 20, 20, '../../img/support-water.png');
const score = new Score();

let SoundLoading = null;
let SoundCollectingSupport = null;
let SoundGameOver = null;
let theme = null;
let gameover = false;
let anime;
let boundaries;

const init = async () => {
    CANVAS = document.getElementById('gameCanvas');

    if (!CANVAS) {
        console.error('Canvas não encontrado');
        return;
    }

    CTX = CANVAS.getContext('2d');

    boundaries = {
        width: CANVAS.width,
        height: CANVAS.height
    };

    balls = balls.map(() =>
        new Ball(
            CANVAS.width - 5,
            Math.random() * CANVAS.height,
            6, 3, 'img/ball.png'
        )
    );

    try {
        SoundLoading = await loadAudio('../../sounds/game-loading.mp3');
        if (SoundLoading?.volume) {
            SoundLoading.volume = .2;
        } else {
            throw new Error('Erro ao carregar o som de carregamento');
        }
    } catch (error) {
        console.error(error);
    }

    try {
        SoundCollectingSupport = await loadAudio('../../sounds/game-collect.mp3');
        if (SoundCollectingSupport?.volume) {
            SoundCollectingSupport.volume = .2;
        } else {
            throw new Error('Erro ao carregar o som de carregamento');
        }
    } catch (error) {
        console.error(error);
    }

    try {
        SoundGameOver = await loadAudio('../../sounds/game-over.mp3');
        if (SoundGameOver?.volume) {
            SoundGameOver.volume = .2;
        } else {
            throw new Error('Erro ao carregar o som de game over');
        }
    } catch (error) {
        console.error(error);
    }

    keyPress(window);

    if (SoundLoading) {
        SoundLoading.play();
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !window.start) {
            window.start = true;
            document.getElementById('loading-screen').style.display = 'none';

            if (SoundLoading) {
                SoundLoading.pause();
                SoundLoading.currentTime = 0;
            }
            loop();
        }
    });

    document.getElementById('loading-screen').style.display = 'flex';
};

const loop = () => {
    setTimeout(() => {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

        if (window.start) {
            hero.draw(CTX);
            hero.move(boundaries, key);
            support.draw(CTX);

            balls.forEach(b => {
                b.move(boundaries);
                b.draw(CTX);

                gameover = !gameover ? hero.colide(b) : true;
            });

            if (theme && !theme.playing) {
                theme.play();
                theme.playing = true;
            }

            const scoring = hero.colide(support);

            if (scoring) {
                score.increment();
                support.updatePosition();
                score.update();
                SoundCollectingSupport.play();
            }

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
