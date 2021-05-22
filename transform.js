const tile_w = 30;
const tile_h = 60;
export default class Transform {
	constructor(x, y, tile_w, tile_h) {
		this.LAST_X = {
			left: x + tile_w / 2,
			right: x + tile_w / 2
		};
		this.LAST_Y = {
			left: y + tile_h / 2,
			right: y + tile_h / 2
		};
		this.tile_h = tile_h;
		this.tile_w = tile_w;
		this.TO_RADIANS = Math.PI / 180;
	}
	tranformRotation(ctx, image, translate_xy, move_xy, deg) {
		ctx.save();
		ctx.translate(translate_xy[0], translate_xy[1]);
		ctx.rotate(deg * this.TO_RADIANS);
		ctx.drawImage(
			image,
			-(move_xy[0] + tile_w / 2),
			-(move_xy[1] + tile_h / 2),
			this.tile_w,
			this.tile_h
		);
		ctx.restore();
	}
	newTranslation(direction, vertical, after_double, is_double, max_h, max_v) {
		let shift = {};
		if (max_v) {
			if (after_double == "h") {
				shift = {
					left: [this.tile_h, 0],
					right: [-this.tile_h, 0]
				};
			} else {
				shift =
					vertical == "down"
						? {
								left: [1.5 * this.tile_w, this.tile_w / 2],
								right: [-1.5 * this.tile_w, this.tile_w / 2]
						  }
						: {
								left: [1.5 * this.tile_w, -this.tile_w / 2],
								right: [-1.5 * this.tile_w, -this.tile_w / 2]
						  };
			}
		} else if (max_h) {
			shift =
				vertical == "down"
					? {
							left: [-1.5 * this.tile_w, this.tile_w / 2],
							right: [1.5 * this.tile_w, this.tile_w / 2]
					  }
					: {
							left: [-1.5 * this.tile_w, -this.tile_w / 2],
							right: [1.5 * this.tile_w, -this.tile_w / 2]
					  };
		} else if (is_double) {
			if (vertical) {
				let c = vertical == "top" ? -1 : 1;
				shift = {
					left: [0, c * 1.5 * this.tile_w],
					right: [0, c * 1.5 * this.tile_w]
				};
			} else {
				shift = {
					left: [-1.5 * this.tile_w, 0],
					right: [1.5 * this.tile_w, 0]
				};
			}
		} else if (after_double) {
			let c = vertical == "top" ? -1 : 1;
			shift =
				after_double == "v"
					? {
							left: [-1.5 * this.tile_w, 0],
							right: [1.5 * this.tile_w, 0]
					  }
					: {
							left: [0, c * 1.5 * this.tile_w],
							right: [0, c * 1.5 * this.tile_w]
					  };
		} else {
			if (vertical) {
				shift =
					vertical == "down"
						? {
								left: [0, this.tile_h],
								right: [0, this.tile_h]
						  }
						: {
								left: [0, -this.tile_h],
								right: [0, -this.tile_h]
						  };
			} else {
				shift = {
					left: [-tile_h, 0],
					right: [tile_h, 0]
				};
			}
		}
		return shift;
	}
	isDouble(direction, vertical) {
		let x = 0;
		let y = 0;
		if (vertical) {
			[x, y] =
				vertical == "down"
					? [-1.5 * this.tile_w, 0]
					: [1.5 * this.tile_w, 0];
		} else {
			let c = direction == "right" ? -1 : 1;
			[x, y] = [c * 1.5 * this.tile_w, 0];
		}
		return [x, y];
	}
	samePath(direction, flipped, vertical) {
		let y = 0;
		if (vertical) {
			let c = vertical == "top" ? 1 : -1;
			if (flipped) {
				y = -c * this.tile_h;
			} else {
				y = c * this.tile_h;
			}
		} else {
			let c = direction == "left" ? -1 : 1;
			if (flipped) {
				y = -c * this.tile_h;
			} else {
				y = c * this.tile_h;
			}
		}
		return [0, y];
	}
	changedPath(direction, flipped, vertical, after_double, max_h, max_v) {
		let x = 0;
		let y = 0;
		let c = direction == "left" ? 1 : -1;
		if (max_h) {
			if (vertical == "top") {
				[x, y] = flipped
					? [-c * 1.5 * this.tile_w, -0.5 * this.tile_w]
					: [c * 1.5 * this.tile_w, 0.5 * this.tile_w];
			} else {
				[x, y] = flipped
					? [-c * 1.5 * this.tile_w, 0.5 * this.tile_w]
					: [c * 1.5 * this.tile_w, -0.5 * this.tile_w];
			}
		} else if (max_v) {
			let c = direction == "left" ? 1 : -1;
			let c2 = vertical == "top" ? this.tile_w / 2 : -this.tile_w / 2;
			if (after_double) {
				let c3 = flipped ? -1 : 1;
				[x, y] =
					vertical == "top"
						? [0, c * c3 * this.tile_h]
						: [0, c * c3 * this.tile_h];
			} else if (flipped) {
				[x, y] = [-c2, -c * this.tile_w * 1.5];
			} else {
				[x, y] = [c2, c * this.tile_w * 1.5];
			}
		}

		return [x, y];
	}
	verticalDoubleToFlat_xy(direction, flipped, vertical, after_double) {
		/*
        This function find the coordinate of the image after performing the necssary transition/rotation , after the first double [6/6]
        */
		let x = 0;
		let y = 0;
		if (after_double == "v") {
			let signal = flipped ? -1 : 1;
			[x, y] =
				direction == "right"
					? [0, signal * (this.tile_h - this.tile_w / 2)]
					: [0, -signal * (this.tile_h - this.tile_w / 2)];
		} else {
			let signal = flipped ? -1 : 1;
			[x, y] =
				vertical == "top"
					? [0, signal * 1.5 * this.tile_w]
					: [0, signal * -1.5 * this.tile_w];
		}
		return [x, y];
	}
	setTransform(
		ctx,
		image,
		direction = "",
		flipped = false,
		vertical = "",
		after_double = "",
		is_double,
		max_h,
		max_v,
		switch_path,
		rect = false
	) {
		/* Perform the transormation necessary depending on the input*/
		let move_xy = [0, 0];
		let degree = flipped ? -90 : 90;
		let dir = direction;
		if (switch_path[direction]) {
			dir = direction == "left" ? "right" : "left";
		}
		if (max_h || max_v) {
			move_xy = this.changedPath(
				dir,
				flipped,
				vertical,
				after_double,
				max_h,
				max_v
			);
			if (vertical && max_h) {
				degree = flipped ? 180 : 0;
			}
		} else if (after_double) {
			move_xy = this.verticalDoubleToFlat_xy(
				dir,
				flipped,
				vertical,
				after_double
			);
			if (after_double === "h") {
				degree = flipped ? 180 : 0;
			}
		} else if (is_double) {
			move_xy = this.isDouble(dir, vertical);
			degree = vertical ? 90 : 0;
		} else {
			move_xy = this.samePath(dir, flipped, vertical);
			if (vertical) {
				degree = flipped ? 180 : 0;
			}
		}
		let shift = {};

		this.tranformRotation(
			ctx,
			image,
			[this.LAST_X[direction], this.LAST_Y[direction]],
			move_xy,
			degree
		);

		shift = this.newTranslation(
			dir,
			vertical,
			after_double,
			is_double,
			max_h,
			max_v
		);
		this.LAST_X[direction] += shift[dir][0];
		this.LAST_Y[direction] += shift[dir][1];

		//ctx.fillStyle = "red";
		//ctx.fillRect(this.LAST_X[dir], this.LAST_Y[dir], 5, 5);
	}
}