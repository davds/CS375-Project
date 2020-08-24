(function (exports) { // https://caolan.uk/articles/writing-for-node-and-the-browser/
  //Precondish: [pos[0], pos[1]] is the left end point of the blinker
  //Postcondish: returns a horizontal blinker
  //type: oscillator, size: 3x3
  function makeBlinkerPos(pos) {
    positions = [
      [pos[0], pos[1]],
      [pos[0] + 1, pos[1]],
      [pos[0] + 2, pos[1]],
    ];
    return positions;
  }
  //Precondish: [pos[0], pos[1]] is the top left of the square
  //Postcondish: returns a square
  //type: still life, size: 2x2
  function makeSquarePos(pos) {
    positions = [
      [pos[0], pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 1, pos[1]],
      [pos[0] + 1, pos[1] + 1],
    ];
    return positions;
  }
  //Precondish: [pos[0], pos[1]] is the top left of the barge
  //Postcondish: returns a barge pattern
  //type: still life, size: 4x4
  function makeBargePos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 3, pos[1] + 2],
      [pos[0] + 2, pos[1] + 3],
    ];
    return positions;
  }
  //Precondish: [pos[0], pos[1]] is the top left of the hive
  //Postcondish: returns a hive pattern
  //type: still life, size: 4x3
  function makeHivePos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 2, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
    ];
    return positions;
  }
  //Precondish: [pos[0], pos[1]] is the top left of the hive
  //Postcondish: returns a hive pattern
  //type: still life, size: 4x3
  function makeHivePos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 2, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 3, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
    ];
    return positions;
  }
  //Precondish: [pos[0], pos[1]] is the top left of the hat
  //Postcondish: returns a hat pattern
  //type: still life, size: 5x4
  function makeHivePos(pos) {
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
  }
  //Precondish: [pos[0], pos[1]] is the top left of the boat
  //Postcondish: returns a boat pattern
  //type: still life, size: 3x3
  function makeBoatPos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
    ];
    return positions;
  }
  //Precondish: [pos[0], pos[1]] is the top left of the long boat
  //Postcondish: returns a long boat pattern
  //type: still life, size: 5x5
  function makeLongBoatPos(pos) {
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
  }
  //Precondish: [pos[0], pos[1]] is the top left of the beacon
  //Postcondish: returns a beacon pattern
  //type: oscillator, size: 4x4
  function makeBeaconPos(pos) {
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
  }
  //Precondish: [pos[0], pos[1]] is the top left of the toad
  //Postcondish: returns a toad pattern
  //type: oscillator, size: 4x4
  function makeToadPos(pos) {
    positions = [
      [pos[0] + 1, pos[1]],
      [pos[0] + 1, pos[1] + 1],
      [pos[0] + 2, pos[1] + 1],
      [pos[0] + 1, pos[1] + 2],
      [pos[0] + 2, pos[1] + 2],
      [pos[0] + 2, pos[1] + 3],
    ];
    return positions;
  }
  //Precondish: [pos[0], pos[1]] is the top left of the bipole
  //Postcondish: returns a bipole pattern
  //type: oscillator, size: 5x5
  function makeBipolePos(pos) {
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
  //Precondish: duble with x, y coords of center of a glider, a string representing orientation of glider
  //Postcondish: returns positions of cells needed to make glider
  function makeGliderxPos(gliderPos, orientation) {
    newPositions = []; 
    switch(orientation) {
      case "SE":
        newPositions = [
          [gliderPos[0], gliderPos[1] -1],
          [gliderPos[0] + 1, gliderPos[1]],
          [gliderPos[0] - 1, gliderPos[1] + 1],
          [gliderPos[0], gliderPos[1] + 1],
          [gliderPos[0] + 1, gliderPos[1] + 1]
        ];
        break;
      case "NE":
        newPositions = [
          [gliderPos[0], gliderPos[1] - 1],
          [gliderPos[0] + 1, gliderPos[1] - 1],
          [gliderPos[0] - 1, gliderPos[1]],
          [gliderPos[0] + 1, gliderPos[1]],
          [gliderPos[0] + 1, gliderPos[1] + 1]
        ];
        break;
      case "NW":
        newPositions = [
          [gliderPos[0], gliderPos[1] - 1],
          [gliderPos[0] + 1, gliderPos[1] - 1],
          [gliderPos[0] - 1, gliderPos[1] - 1],
          [gliderPos[0] - 1, gliderPos[1]],
          [gliderPos[0], gliderPos[1] + 1]
        ];
        break;
      case "SW":
        newPositions = [
          [gliderPos[0] - 1, gliderPos[1] - 1],
          [gliderPos[0] - 1, gliderPos[1]],
          [gliderPos[0] + 1, gliderPos[1]],
          [gliderPos[0] - 1, gliderPos[1] + 1],
          [gliderPos[0], gliderPos[1] + 1]
        ];
        break;
    }
    return newPositions;
  }
  exports.makeGliderxPos = makeGliderxPos;

})(typeof exports === 'undefined'? this['shared']={}: exports);