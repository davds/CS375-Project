(function (exports) { // https://caolan.uk/articles/writing-for-node-and-the-browser/
  //Precondish: duble with x, y coords of center of a glider, a string representing orientation of glider
  //Postcondish: returns positions of cells needed to make glider
  function makeGliderPos(gliderPos, orientation) {
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
  exports.makeGliderPos = makeGliderPos;

})(typeof exports === 'undefined'? this['shared']={}: exports);
