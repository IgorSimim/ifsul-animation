import Ball from "./Ball";
import Hero from "./Hero";
// import { keyDownUp, hasKey } from "./keyboard"; 
import { keyPress, key } from "./keyboard";

let CTX;
let CANVAS;
const FRAMES = 60;

const qtdBalls = 1;
let balls = Array.from({ length: qtdBalls });

const hero = new Hero(7, 50, 10, 2, 20, 5, 'img/goalkeeper.png', FRAMES);

let gameover = false;
let anime;
let boundaries;

const init = () => {
    console.log("Initialize Canvas");
    CANVAS = document.querySelector('canvas');
    CTX = CANVAS.getContext('2d');

    boundaries = {
        width: CANVAS.width,
        height: CANVAS.height,
    };

    balls = balls.map(() =>
        new Ball(
            CANVAS.width - 5,
            Math.random() * CANVAS.height,
            8, 3, 'img/ball.png'
        )
    );

    // keyDownUp(window);
    keyPress(window);
    loop();
};

const loop = () => {
    setTimeout(() => {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
        hero.move(boundaries, key)
        hero.draw(CTX)

        // if (hasKey('ArrowDown')) {
        //     hero.moveDown(boundaries);
        // }
        // if (hasKey('ArrowUp')) {
        //     hero.moveUp(boundaries);
        // }
        // if (hasKey('ArrowRight')) {
        //     hero.moveRight(boundaries);
        // }
        // if (hasKey('ArrowLeft')) {
        //     hero.moveLeft(boundaries);
        // }

        balls.forEach(b => {
            b.move(boundaries);
            b.draw(CTX);
            gameover = !gameover ? hero.colide(b) : true;
        });

        if (gameover) {
            console.error('GOL!!!');
            cancelAnimationFrame(anime);
        } else {
            anime = requestAnimationFrame(loop);
        }
    }, 1000 / FRAMES);
};

export { init };