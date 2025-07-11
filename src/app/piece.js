class Piece {
  constructor( color,  type, location) {
    this.color = color; // e.g., 'white' or 'black'
    this.location = location; // e.g., { row: 0, col: 0 }
    this.type = type; // e.g., 'pawn', 'rook', 'knight', etc.

  }
    getLocation() {
        return this.location;
    }
    setLocation(newLocation) {
        this.location = newLocation;
    }

  getColor() {
    return this.color;
  }
  getType() {
    return this.type;
  }

  toString() {
    return `${this.color} ${this.type}`;
  }
  

  canMove(currentLocation, newLocation) {
  switch (this.type) {
    case 'pawn':
      if (this.isValidPawnMove(currentLocation, newLocation)) {
        return true;
      } else {
        throw new Error('this is not a valid pawn move');
      }
    case 'rook':
      if (this.isValidRookMove(newLocation)) {
        return true;
      } else {
        throw new Error('Invalid rook move');
      }
    case 'knight':
      if (this.isValidKnightMove(newLocation)) {
        return true;
      } else {
        throw new Error('Invalid knight move');
      }
    case 'bishop':
      if (this.isValidBishopMove(newLocation)) {
        return true;
      } else {
        throw new Error('Invalid bishop move');
      }
    case 'queen':
      if (this.isValidQueenMove(newLocation)) {
        return true;
      } else {
        throw new Error('Invalid queen move');
      }
    case 'king':
      if (this.isValidKingMove(newLocation)) {
        return true;
      } else {
        throw new Error('Invalid king move');
      }
    default:
      throw new Error('Unknown piece type');
  }
}

  isValidPawnMove(currentLocation, newLocation) {
    console.log("checking pawn move");
    console.log("currentLocation:", currentLocation);
    console.log("newLocation:", newLocation);
    // If the pawn is black
    if(this.color === 'black') {
    console.log("checking black pawn move");
    if(currentLocation.row === 1  && newLocation.row === 3 && currentLocation.col === newLocation.col) {
      return true;
    } else if (newLocation.row === currentLocation.row + 1 && newLocation.col === currentLocation.col) {
      return true;
    }
    }
    // If the pawn is white
    else{
      console.log("checking white pawn move");
 
    if(currentLocation.row === 6 && newLocation.row === 4 && currentLocation.col === newLocation.col) {
      return true;
    } else if (newLocation.row === currentLocation.row - 1 && newLocation.col === currentLocation.col) {
      return true;
    }

    }
    return false;
}
isValidPawnCapture(currentLocation, newLocation) {
  // If the pawn is black
  if (this.color === 'black') {
    if (
  newLocation.row === currentLocation.row - 1 &&
  Math.abs(newLocation.col - currentLocation.col) === 1
) {
  return true; // Black pawn capturing diagonally
}
  }
    // If the pawn is white
  else{

    if (newLocation.row === currentLocation.row + 1 && Math.abs(newLocation.col - currentLocation.col) === 1) {
      return true;
    }
  }
  return false;

  }
  isValidRookMove(newLocation) {
    // Logic specific to rook movement
  }
  isValidKnightMove(newLocation) {
    // Logic specific to knight movement
  }
  isValidBishopMove(newLocation) {
    // Logic specific to bishop movement
  }
  isValidQueenMove(newLocation) {
    // Logic specific to queen movement
  }
  isValidKingMove(newLocation) {
    // Logic specific to king movement
  }


}

export default  Piece;