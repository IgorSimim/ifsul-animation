import Circle from "./geometries/Circle";
import { loadImage } from "./loaderAssets";

class Support extends Circle {
	constructor(size, width, height, imgUrl) {
		const x = Math.random() * (849 - width);
		const y = Math.random() * (507 - height);
		super(x, y, size);

		this.imgUrl = imgUrl;
		loadImage(this.imgUrl).then(img => {
			this.img = img;
		});

		this.width = width;
		this.height = height;

		this.hit = new Circle(
			this.x + this.width / 2,
			this.y + this.height / 2,
			this.size,
			0, "rgba(0,0,255,.5)"
		);
	}

	animeSprite(FRAMES) {
		setInterval(() => {
			this.cellX = this.cellX < this.totalSprites - 1
				? this.cellX + 1
				: 0;
		}, 1000 / (FRAMES * this.spriteSpeed / 10));
	}

	draw(CTX) {
		CTX.drawImage(
			this.img,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}

	generatePosition() {
		const x = Math.random() * (849 - this.width);
		const y = Math.random() * (507 - this.height);
		return { x, y };
	}

	updatePosition() {
		const { x, y } = this.generatePosition();
		this.x = x;
		this.y = y;
		this.updateHit();
	}

	updateHit() {
		this.hit.x = this.x + this.width / 2;
		this.hit.y = this.y + this.height / 2;
	}

	colide(other) {
		return (this.hit.size + other.size >= Math.sqrt(
			(this.hit.x - other.x) ** 2 + (this.hit.y - other.y) ** 2
		));
	}
}

export default Support;
