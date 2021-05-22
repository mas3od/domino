const IMAGE_TYPE = ".png";
const IMAGES_PATH = "dominoes/new/";
const tile_w = 30;
const tile_h = 60;
export default class Domino {
	constructor(src, me) {
		this.src = IMAGES_PATH + src + IMAGE_TYPE;
		this.height = tile_h;
		this.width = tile_w;
		this.hidden = true;
		this.double = false;
		this.val = src.split("-");
		if (src[0] === src[2]) {
			this.double = true;
		}

		this.me = me;
		if (this.me) {
			this.hidden = false;
		}

		this.rotated = false;
		this.image = new Image();
		this.image.src = this.src;
		this.alt = new Image();
		this.alt.src = "dominoes/new/hidden.png";
		this.alt2 = new Image();
		this.alt2.src = "dominoes/new/hidden-r.png";
		this.x = 0;
		this.y = 0;
		this.count = parseInt(this.val[0]) + parseInt(this.val[1]);
	}
}
