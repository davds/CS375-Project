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
  makeHatPos: function makeHatPos(pos) {
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
  },
  //Precondish: [pos[0], pos[1]] is the top left of p11
  //Postcondish: returns a p11 pattern
  //type: oscillator, size: 22x22
  makeP11Pos: function makeP11Pos(pos) {
    positions = [
      [pos[0] + 10, pos[1]],
      [pos[0] + 11, pos[1]],
      [pos[0] + 10, pos[1] + 1],
      [pos[0] + 11, pos[1] + 1],
      [pos[0] + 5, pos[1] + 2],
      [pos[0] + 16, pos[1] + 2],
      [pos[0] + 4, pos[1] + 3],
      [pos[0] + 6, pos[1] + 3],
      [pos[0] + 15, pos[1] + 3],
      [pos[0] + 17, pos[1] + 3],
      [pos[0] + 3, pos[1] + 4],
      [pos[0] + 5, pos[1] + 4],
      [pos[0] + 9, pos[1] + 4],
      [pos[0] + 12, pos[1] + 4],
      [pos[0] + 16, pos[1] + 4],
      [pos[0] + 18, pos[1] + 4],
      [pos[0] + 2, pos[1] + 5],
      [pos[0] + 4, pos[1] + 5],
      [pos[0] + 9, pos[1] + 5],
      [pos[0] + 12, pos[1] + 5],
      [pos[0] + 17, pos[1] + 5],
      [pos[0] + 19, pos[1] + 5],
      [pos[0] + 3, pos[1] + 6],
      [pos[0] + 9, pos[1] + 6],
      [pos[0] + 12, pos[1] + 6],
      [pos[0] + 18, pos[1] + 6],
      [pos[0] + 4, pos[1] + 9],
      [pos[0] + 5, pos[1] + 9],
      [pos[0] + 6, pos[1] + 9],
      [pos[0] + 15, pos[1] + 9],
      [pos[0] + 16, pos[1] + 9],
      [pos[0] + 17, pos[1] + 9],
      [pos[0], pos[1] + 10],
      [pos[0] + 1, pos[1] + 10],
      [pos[0] + 20, pos[1] + 10],
      [pos[0] + 21, pos[1] + 10],
      [pos[0], pos[1] + 11],
      [pos[0] + 1, pos[1] + 11],
      [pos[0] + 20, pos[1] + 11],
      [pos[0] + 21, pos[1] + 11],
      [pos[0] + 4, pos[1] + 12],
      [pos[0] + 5, pos[1] + 12],
      [pos[0] + 6, pos[1] + 12],
      [pos[0] + 15, pos[1] + 12],
      [pos[0] + 16, pos[1] + 12],
      [pos[0] + 17, pos[1] + 12],
      [pos[0] + 3, pos[1] + 15],
      [pos[0] + 9, pos[1] + 15],
      [pos[0] + 12, pos[1] + 15],
      [pos[0] + 18, pos[1] + 15],
      [pos[0] + 2, pos[1] + 16],
      [pos[0] + 4, pos[1] + 16],
      [pos[0] + 9, pos[1] + 16],
      [pos[0] + 12, pos[1] + 16],
      [pos[0] + 17, pos[1] + 16],
      [pos[0] + 19, pos[1] + 16],
      [pos[0] + 3, pos[1] + 17],
      [pos[0] + 5, pos[1] + 17],
      [pos[0] + 9, pos[1] + 17],
      [pos[0] + 12, pos[1] + 17],
      [pos[0] + 16, pos[1] + 17],
      [pos[0] + 18, pos[1] + 17],
      [pos[0] + 4, pos[1] + 18],
      [pos[0] + 6, pos[1] + 18],
      [pos[0] + 15, pos[1] + 18],
      [pos[0] + 17, pos[1] + 18],
      [pos[0] + 5, pos[1] + 19],
      [pos[0] + 16, pos[1] + 19],
      [pos[0] + 10, pos[1] + 20],
      [pos[0] + 11, pos[1] + 20],
      [pos[0] + 10, pos[1] + 21],
      [pos[0] + 11, pos[1] + 21],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the p16
  //Postcondish: returns a p16 pattern
  //type: oscillator, size: 15x15
  makeP16Pos: function makeP16Pos(pos) {
    positions = [
      [pos[0] + 7, pos[1]],
      [pos[0] + 8, pos[1]],
      [pos[0] + 7, pos[1] + 1],
      [pos[0] + 9, pos[1] + 1],
      [pos[0] + 2, pos[1] + 2],
      [pos[0] + 7, pos[1] + 2],
      [pos[0] + 9, pos[1] + 2],
      [pos[0] + 10, pos[1] + 2],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 8, pos[1] + 3],
      [pos[0], pos[1] + 4],
      [pos[0] + 3, pos[1] + 4],
      [pos[0], pos[1] + 5],
      [pos[0] + 1, pos[1] + 5],
      [pos[0] + 2, pos[1] + 5],
      [pos[0] + 10, pos[1] + 7],
      [pos[0] + 11, pos[1] + 7],
      [pos[0] + 12, pos[1] + 7],
      [pos[0] + 9, pos[1] + 8],
      [pos[0] + 12, pos[1] + 8],
      [pos[0] + 4, pos[1] + 9],
      [pos[0] + 10, pos[1] + 9],
      [pos[0] + 11, pos[1] + 9],
      [pos[0] + 2, pos[1] + 10],
      [pos[0] + 3, pos[1] + 10],
      [pos[0] + 5, pos[1] + 10],
      [pos[0] + 10, pos[1] + 10],
      [pos[0] + 3, pos[1] + 11],
      [pos[0] + 5, pos[1] + 11],
      [pos[0] + 4, pos[1] + 12],
      [pos[0] + 5, pos[1] + 12],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the p144
  //Postcondish: returns a p144 pattern
  //type: oscillator, size: 30x19
  makeP144Pos: function makeP144Pos(pos) {
    positions = [
      [pos[0], pos[1]],
      [pos[0] + 1, pos[1]],
      [pos[0] + 26, pos[1]],
      [pos[0] + 27, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 1, pos[1] + 1],
      [pos[0] + 26, pos[1] + 1],
      [pos[0] + 27, pos[1] + 1],
      [pos[0] + 18, pos[1] + 2],
      [pos[0] + 19, pos[1] + 2],
      [pos[0] + 17, pos[1] + 3],
      [pos[0] + 20, pos[1] + 3],
      [pos[0] + 18, pos[1] + 4],
      [pos[0] + 19, pos[1] + 4],
      [pos[0] + 14, pos[1] + 5],
      [pos[0] + 13, pos[1] + 6],
      [pos[0] + 15, pos[1] + 6],
      [pos[0] + 12, pos[1] + 7],
      [pos[0] + 16, pos[1] + 7],
      [pos[0] + 12, pos[1] + 8],
      [pos[0] + 15, pos[1] + 8],
      [pos[0] + 12, pos[1] + 10],
      [pos[0] + 15, pos[1] + 10],
      [pos[0] + 11, pos[1] + 11],
      [pos[0] + 15, pos[1] + 11],
      [pos[0] + 12, pos[1] + 12],
      [pos[0] + 14, pos[1] + 12],
      [pos[0] + 13, pos[1] + 13],
      [pos[0] + 8, pos[1] + 14],
      [pos[0] + 9, pos[1] + 14],
      [pos[0] + 7, pos[1] + 15],
      [pos[0] + 10, pos[1] + 15],
      [pos[0] + 8, pos[1] + 16],
      [pos[0] + 9, pos[1] + 16],
      [pos[0], pos[1] + 17],
      [pos[0] + 1, pos[1] + 17],
      [pos[0] + 26, pos[1] + 17],
      [pos[0] + 27, pos[1] + 17],
      [pos[0], pos[1] + 18],
      [pos[0] + 1, pos[1] + 18],
      [pos[0] + 26, pos[1] + 18],
      [pos[0] + 27, pos[1] + 18],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the circle
  //Postcondish: returns a circle pattern
  //type: oscillator, size: 11x11
  makeCirclePos: function makeCirclePos(pos) {
    positions = [
      [pos[0] + 4, pos[1]],
      [pos[0] + 6, pos[1]],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 5, pos[1] + 1],
      [pos[0] + 8, pos[1] + 1],
      [pos[0] + 3, pos[1] + 2],
      [pos[0] + 5, pos[1] + 2],
      [pos[0] + 7, pos[1] + 2],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 3, pos[1] + 3],
      [pos[0] + 5, pos[1] + 3],
      [pos[0] + 7, pos[1] + 3],
      [pos[0] + 8, pos[1] + 3],
      [pos[0] + 9, pos[1] + 3],
      [pos[0] + 5, pos[1] + 4],
      [pos[0], pos[1] + 5],
      [pos[0] + 1, pos[1] + 5],
      [pos[0] + 2, pos[1] + 5],
      [pos[0] + 3, pos[1] + 5],
      [pos[0] + 4, pos[1] + 5],
      [pos[0] + 6, pos[1] + 5],
      [pos[0] + 7, pos[1] + 5],
      [pos[0] + 8, pos[1] + 5],
      [pos[0] + 9, pos[1] + 5],
      [pos[0] + 10, pos[1] + 5],
      [pos[0] + 5, pos[1] + 6],
      [pos[0] + 1, pos[1] + 7],
      [pos[0] + 2, pos[1] + 7],
      [pos[0] + 3, pos[1] + 7],
      [pos[0] + 5, pos[1] + 7],
      [pos[0] + 7, pos[1] + 7],
      [pos[0] + 8, pos[1] + 7],
      [pos[0] + 9, pos[1] + 7],
      [pos[0] + 3, pos[1] + 8],
      [pos[0] + 5, pos[1] + 8],
      [pos[0] + 7, pos[1] + 8],
      [pos[0] + 2, pos[1] + 9],
      [pos[0] + 5, pos[1] + 9],
      [pos[0] + 8, pos[1] + 9],
      [pos[0] + 4, pos[1] + 10],
      [pos[0] + 6, pos[1] + 10],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the eureka
  //Postcondish: returns a eureka pattern
  //type: oscillator, size: 18x15
  makeEurekaPos: function makeEurekaPos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 16, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 7, pos[1] + 1],
      [pos[0] + 15, pos[1] + 1],
      [pos[0] + 17, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 5, pos[1] + 2],
      [pos[0] + 6, pos[1] + 2],
      [pos[0] + 8, pos[1] + 2],
      [pos[0] + 9, pos[1] + 2],
      [pos[0] + 16, pos[1] + 2],
      [pos[0] + 7, pos[1] + 3],
      [pos[0] + 7, pos[1] + 7],
      [pos[0] + 1, pos[1] + 8],
      [pos[0] + 5, pos[1] + 8],
      [pos[0] + 6, pos[1] + 8],
      [pos[0] + 8, pos[1] + 8],
      [pos[0] + 9, pos[1] + 8],
      [pos[0] + 16, pos[1] + 8],
      [pos[0], pos[1] + 9],
      [pos[0] + 2, pos[1] + 9],
      [pos[0] + 7, pos[1] + 9],
      [pos[0] + 15, pos[1] + 9],
      [pos[0] + 17, pos[1] + 9],
      [pos[0] + 1, pos[1] + 10],
      [pos[0] + 16, pos[1] + 10],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the clip
  //Postcondish: returns a clip pattern
  //type: still life, size: 9x8
  makeClipPos: function makeClipPos(pos) {
    positions = [
      [pos[0] + 2, pos[1]],
      [pos[0] + 6, pos[1]],
      [pos[0] + 1, pos[1] + 1],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 5, pos[1] + 1],
      [pos[0] + 7, pos[1] + 1],
      [pos[0], pos[1] + 2],
      [pos[0] + 3, pos[1] + 2],
      [pos[0] + 5, pos[1] + 2],
      [pos[0] + 8, pos[1] + 2],
      [pos[0], pos[1] + 3],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 3, pos[1] + 3],
      [pos[0] + 5, pos[1] + 3],
      [pos[0] + 7, pos[1] + 3],
      [pos[0] + 8, pos[1] + 3],
      [pos[0] + 3, pos[1] + 4],
      [pos[0] + 5, pos[1] + 4],
      [pos[0], pos[1] + 5],
      [pos[0] + 1, pos[1] + 5],
      [pos[0] + 3, pos[1] + 5],
      [pos[0] + 5, pos[1] + 5],
      [pos[0] + 7, pos[1] + 5],
      [pos[0] + 8, pos[1] + 5],
      [pos[0], pos[1] + 6],
      [pos[0] + 3, pos[1] + 6],
      [pos[0] + 5, pos[1] + 6],
      [pos[0] + 8, pos[1] + 6],
      [pos[0] + 1, pos[1] + 7],
      [pos[0] + 2, pos[1] + 7],
      [pos[0] + 6, pos[1] + 7],
      [pos[0] + 7, pos[1] + 7],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the 31.4
  //Postcondish: returns a 31.4 pattern
  //type: still life, size: 13x8
  make31Dot4Pos: function make31Dot4Pos(pos) {
    positions = [
      [pos[0] + 2, pos[1]],
      [pos[0] + 3, pos[1]],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 4, pos[1] + 1],
      [pos[0] + 4, pos[1] + 2],
      [pos[0] + 9, pos[1] + 2],
      [pos[0] + 10, pos[1] + 2],
      [pos[0], pos[1] + 3],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 3, pos[1] + 3],
      [pos[0] + 5, pos[1] + 3],
      [pos[0] + 6, pos[1] + 3],
      [pos[0] + 9, pos[1] + 3],
      [pos[0] + 12, pos[1] + 3],
      [pos[0], pos[1] + 4],
      [pos[0] + 3, pos[1] + 4],
      [pos[0] + 5, pos[1] + 4],
      [pos[0] + 7, pos[1] + 4],
      [pos[0] + 9, pos[1] + 4],
      [pos[0] + 11, pos[1] + 4],
      [pos[0] + 12, pos[1] + 4],
      [pos[0] + 3, pos[1] + 5],
      [pos[0] + 5, pos[1] + 5],
      [pos[0] + 7, pos[1] + 5],
      [pos[0] + 9, pos[1] + 5],
      [pos[0] + 4, pos[1] + 6],
      [pos[0] + 5, pos[1] + 6],
      [pos[0] + 7, pos[1] + 6],
      [pos[0] + 9, pos[1] + 6],
      [pos[0] + 8, pos[1] + 7],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the century eater
  //Postcondish: returns a century eater pattern
  //type: still life, size: 8x7
  makeCenturyEaterPos: function makeCenturyEaterPos(pos) {
    positions = [
      [pos[0] + 3, pos[1]],
      [pos[0] + 5, pos[1]],
      [pos[0] + 6, pos[1]],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 4, pos[1] + 1],
      [pos[0] + 6, pos[1] + 1],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 3, pos[1] + 3],
      [pos[0] + 4, pos[1] + 3],
      [pos[0] + 5, pos[1] + 3],
      [pos[0], pos[1] + 4],
      [pos[0] + 3, pos[1] + 4],
      [pos[0] + 6, pos[1] + 4],
      [pos[0], pos[1] + 5],
      [pos[0] + 1, pos[1] + 5],
      [pos[0] + 5, pos[1] + 5],
      [pos[0] + 7, pos[1] + 5],
      [pos[0] + 6, pos[1] + 6],
      [pos[0] + 7, pos[1] + 6],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the long ship
  //Postcondish: returns a long ship pattern
  //type: still life, size: 13x13
  makeLongShipPos: function makeLongShipPos(pos) {
    positions = [
      [pos[0] + 11, pos[1]],
      [pos[0] + 12, pos[1]],
      [pos[0] + 10, pos[1] + 1],
      [pos[0] + 12, pos[1] + 1],
      [pos[0] + 9, pos[1] + 2],
      [pos[0] + 11, pos[1] + 2],
      [pos[0] + 8, pos[1] + 3],
      [pos[0] + 10, pos[1] + 3],
      [pos[0] + 7, pos[1] + 4],
      [pos[0] + 9, pos[1] + 4],
      [pos[0] + 6, pos[1] + 5],
      [pos[0] + 8, pos[1] + 5],
      [pos[0] + 5, pos[1] + 6],
      [pos[0] + 7, pos[1] + 6],
      [pos[0] + 4, pos[1] + 7],
      [pos[0] + 6, pos[1] + 7],
      [pos[0] + 3, pos[1] + 8],
      [pos[0] + 5, pos[1] + 8],
      [pos[0] + 2, pos[1] + 9],
      [pos[0] + 4, pos[1] + 9],
      [pos[0] + 1, pos[1] + 10],
      [pos[0] + 3, pos[1] + 10],
      [pos[0], pos[1] + 11],
      [pos[0] + 2, pos[1] + 11],
      [pos[0], pos[1] + 12],
      [pos[0] + 1, pos[1] + 12],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the cyclic
  //Postcondish: returns a cyclic pattern
  //type: oscillator, size: 10x10
  makeCyclicPos: function makeCyclicPos(pos) {
    positions = [
      [pos[0] + 4, pos[1]],
      [pos[0] + 5, pos[1]],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 6, pos[1] + 1],
      [pos[0] + 3, pos[1] + 2],
      [pos[0] + 5, pos[1] + 2],
      [pos[0] + 6, pos[1] + 2],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 5, pos[1] + 3],
      [pos[0] + 7, pos[1] + 3],
      [pos[0] + 8, pos[1] + 3],
      [pos[0] + 0, pos[1] + 4],
      [pos[0] + 6, pos[1] + 4],
      [pos[0] + 7, pos[1] + 4],
      [pos[0] + 9, pos[1] + 4],
      [pos[0] + 0, pos[1] + 5],
      [pos[0] + 2, pos[1] + 5],
      [pos[0] + 3, pos[1] + 5],
      [pos[0] + 9, pos[1] + 5],
      [pos[0] + 1, pos[1] + 6],
      [pos[0] + 2, pos[1] + 6],
      [pos[0] + 4, pos[1] + 6],
      [pos[0] + 7, pos[1] + 6],
      [pos[0] + 8, pos[1] + 6],
      [pos[0] + 3, pos[1] + 7],
      [pos[0] + 4, pos[1] + 7],
      [pos[0] + 6, pos[1] + 7],
      [pos[0] + 3, pos[1] + 8],
      [pos[0] + 6, pos[1] + 8],
      [pos[0] + 4, pos[1] + 9],
      [pos[0] + 5, pos[1] + 9],
    ];
    return positions;
  },
  //Precondish: [pos[0], pos[1]] is the top left of the Cthulhu
  //Postcondish: returns a Cthulhu pattern
  //type: still life, size: 11x13
  makeCthulhuPos: function makeCthulhuPos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 5, pos[1]],
      [pos[0] + 9, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 4, pos[1] + 1],
      [pos[0] + 6, pos[1] + 1],
      [pos[0] + 8, pos[1] + 1],
      [pos[0] + 10, pos[1] + 1],
      [pos[0], pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
      [pos[0] + 4, pos[1] + 2],
      [pos[0] + 6, pos[1] + 2],
      [pos[0] + 8, pos[1] + 2],
      [pos[0] + 10, pos[1] + 2],
      [pos[0] + 1, pos[1] + 3],
      [pos[0] + 2, pos[1] + 3],
      [pos[0] + 4, pos[1] + 3],
      [pos[0] + 6, pos[1] + 3],
      [pos[0] + 8, pos[1] + 3],
      [pos[0] + 9, pos[1] + 3],
      [pos[0] + 4, pos[1] + 4],
      [pos[0] + 6, pos[1] + 4],
      [pos[0] + 4, pos[1] + 5],
      [pos[0] + 6, pos[1] + 5],
      [pos[0] + 3, pos[1] + 6],
      [pos[0] + 4, pos[1] + 6],
      [pos[0] + 6, pos[1] + 6],
      [pos[0] + 7, pos[1] + 6],
      [pos[0] + 2, pos[1] + 7],
      [pos[0] + 7, pos[1] + 7],
      [pos[0] + 2, pos[1] + 8],
      [pos[0] + 3, pos[1] + 8],
      [pos[0] + 5, pos[1] + 8],
      [pos[0] + 6, pos[1] + 8],
      [pos[0] + 3, pos[1] + 9],
      [pos[0] + 5, pos[1] + 9],
      [pos[0] + 2, pos[1] + 10],
      [pos[0] + 5, pos[1] + 10],
      [pos[0] + 2, pos[1] + 11],
      [pos[0] + 4, pos[1] + 11],
      [pos[0] + 1, pos[1] + 12],
      [pos[0] + 2, pos[1] + 12],
      [pos[0] + 4, pos[1] + 12],
      [pos[0] + 5, pos[1] + 12],
    ];
    return positions;
  }
}

module.exports = methods;