import Circle from "./geometries/Circle";
import { loadImage } from "./loaderAssets";

export default class Ball extends Circle {
	constructor(x, y, size, speed = 10, imgUrl) {
		super(x, y, size, -(speed));
		this.imgUrl = imgUrl;

		this.spriteWidth = 325 / 4;
		this.spriteHeight = 105;
		this.currentFrame = 0;
		this.totalFrames = 4;
		this.frameInterval = 10;
		this.frameCounter = 0;

		loadImage(this.imgUrl).then(img => {
			this.img = img;
		});
	}

	draw(CTX) {
		if (this.img) {
			CTX.drawImage(
				this.img,
				this.currentFrame * this.spriteWidth,
				0,
				this.spriteWidth,
				this.spriteHeight,
				this.x - this.size,
				this.y - this.size,
				this.size * 2,
				this.size * 2
			);

			this.frameCounter++;
			if (this.frameCounter >= this.frameInterval) {
				this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
				this.frameCounter = 0;
			}
		} else {
			super.draw(CTX);
		}
	}

	move(limits) {
		this.x += this.speed;
		this.limits(limits);
	}

	limits(limits) {
		if (this.x + this.size < 0) {
			this.x = limits.width + this.size;
			this.y = Math.random() * limits.height;
		}
	}
}
