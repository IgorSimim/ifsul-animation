import Circle from "./geometries/Circle";
import { loadImage } from "./loaderAssets";

export default class Ball extends Circle {
	constructor(x, y, size, speed = 10, imgUrl) {
		super(x, y, size, -(speed));
		this.imgUrl = imgUrl;

		loadImage(this.imgUrl).then(img => {
			this.img = img;
		});
	}

	draw(ctx) {
		if (this.img) {
			ctx.drawImage(this.img, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
		} else {
			super.draw(ctx);
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