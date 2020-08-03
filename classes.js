class Player {
	constructor(id, style, strength=0) {
		this.id = id;
		this.style = style;
		this.strength = strength;
	}
	getStyle() {
		return this.style;
	}
	setStrength(strength) {
		this.strength = strength;
	}
}

class ActivePiece {
	constructor(pos, owner) {
		this.pos = pos;
		this.owner = owner;
	}
	getOwner() {
		return this.owner;
	}
	getStyle() {
		return this.owner.getStyle();
	}
	getPos() {
		return pos;
	}
}