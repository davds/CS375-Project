var methods = {
  //Precondish: [pos[0], pos[1]] is the left end point of the blinker
  //Postcondish: returns a horizontal blinker
  //type: oscillator, size: 3x3
  makeBlinkerPos: function makeBlinkerPos(pos) {
    positions = [
      [pos[0], pos[1]],
      [pos[0] + 1, pos[1]],
      [pos[0] + 2, pos[1]],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the square
  //Postcondish: returns a square
  //type: still life, size: 2x2
  makeSquarePos: function makeSquarePos(pos) {
    positions = [
      [pos[0], pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 1, pos[1]],
      [pos[0] + 1, pos[1] + 1],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the barge
  //Postcondish: returns a barge pattern
  //type: still life, size: 4x4
  makeBargePos: function makeBargePos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 3, pos[1] + 2],
      [pos[0] + 2, pos[1] + 3],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the hive
  //Postcondish: returns a hive pattern
  //type: still life, size: 4x3
  makeHivePos: function makeHivePos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 2, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the hive
  //Postcondish: returns a hive pattern
  //type: still life, size: 4x3
  makeHivePos: function makeHivePos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 2, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the hat
  //Postcondish: returns a hat pattern
  //type: still life, size: 5x4
  makeHivePos: function makeHivePos(pos) {
    positions = [
      [pos[0] + 2, pos[1]],
      [pos[0] + 1, pos[1] + 1],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 3, pos[1] + 2],
      [pos[0], pos[1] + 3],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 3, pos[1] + 3],
      [pos[0] + 4, pos[1] + 3],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the boat
  //Postcondish: returns a boat pattern
  //type: still life, size: 3x3
  makeBoatPos: function makeBoatPos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the long boat
  //Postcondish: returns a long boat pattern
  //type: still life, size: 5x5
  makeLongBoatPos: function makeLongBoatPos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 3, pos[1] + 2],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 4, pos[1] + 3],
      [pos[0] + 3, pos[1] + 4],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the beacon
  //Postcondish: returns a beacon pattern
  //type: oscillator, size: 4x4
  makeBeaconPos: function makeBeaconPos(pos) {
    positions = [
      [pos[0], pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 1, pos[1]],
      [pos[0] + 1, pos[1] + 1],
      [pos[0] + 2, pos[1] + 2],
      [pos[0] + 3, pos[1] + 2],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 3, pos[1] + 3],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the toad
  //Postcondish: returns a toad pattern
  //type: oscillator, size: 4x4
  makeToadPos: function makeToadPos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 1, pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
      [pos[0] + 2, pos[1] + 3],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the bipole
  //Postcondish: returns a bipole pattern
  //type: oscillator, size: 5x5
  makeBipolePos: function makeBipolePos(pos) {
    positions = [
      [pos[0] + 3, pos[1]],
      [pos[0] + 4, pos[1]],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 4, pos[1] + 1],
      [pos[0], pos[1] + 3],
      [pos[0] + 2, pos[1] + 3],
      [pos[0], pos[1] + 4],
      [pos[0] + 1, pos[1] + 4],
    ];
    return positions;
  }
}
module.exports = methods;