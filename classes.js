class Player {
	constructor(id, skin, strength=0) {
		this.id = id;
		this.skin = skin;
		this.strength = strength;
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