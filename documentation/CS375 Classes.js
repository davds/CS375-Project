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

class BoardPiece {
	constructor(owner="none", style="") {
		this.owner = owner;
		this.style = style;
		this.alive = false;
	}
	getOwner() {
		return this.owner;
	}
	getStyle() {
		return this.style;
	}
	isAlive() {
		// Code to check if alive 
	}
	makeAlive() {
		this.alive = true;
	}
	makeDead() {
		this.alive = false;
	}
}

class Board {
	constructor(dimensions, players, board=null) {
		this.players = players;
		if (board == null) {
			board = [];
			for (let i = 0; i < dimensions[0]; i++)
				board.push([]);
				for (let j = 0; j < dimensions[1]; j++)
					board[i].push[new BoardPiece()];
		}		
		this.board = board;
	}
	updateStrengths() {
		let strengths = {};
		for (i in board) {
			for (j in board[i]) {
				strengths[board[i][j].getOwner()] += 1;
			}
		}
		return strengths();
	}
}

class ActivePiece {
	constructor(pos, owner) {
		this.pos = pos;
		this.owner = owner;
	}
	getStyle() {
		this.owner.getStyle();
	}
	getPos() {
		return pos;
	}
}
/*
let activePieces = [[],[],[],[]]

get {
	return activePieces.json();
}

receive activePieces => draw them on Board;

post { // handle placing pieces
	put playerPiece => activePieces;
}
*/