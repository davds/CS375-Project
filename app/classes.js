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
	getStrength() {
		return this.strength;
	}
	getId() {
		return this.id;
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
	setOwner(owner) {
		this.owner = owner;
	}
	getStyle() {
		return this.owner.getStyle();
	}
	getPos() {
		return this.pos;
	}
}

class GameSession {
	constructor(roomName, player) {
		this.roomName = roomName;
		this.players = [player];
	}
	getRoom() {
		return this.roomName;
	}
	addPlayer(player) {
		this.players.push(player);
	}
	getNumPlayers() {
		return this.players.length;
	}
	removePlayer(id) {
		for (let i = 0; i < this.getNumPlayers(); i++) {
			if (this.players[i].getId() == id) {
				this.players.splice(i,1);
				return true;
			}
		}
		return false;
	}
}

exports.Player = Player;
exports.ActivePiece = ActivePiece;
exports.GameSession = GameSession;
