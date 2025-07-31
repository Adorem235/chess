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
        return this.isValidPawnMove(currentLocation, newLocation);
      case 'rook':
        return this.isValidRookMove(currentLocation, newLocation);
      case 'knight':
        return this.isValidKnightMove(currentLocation, newLocation);
      case 'bishop':
        return this.isValidBishopMove(currentLocation, newLocation);
      case 'queen':
        return this.isValidQueenMove(currentLocation, newLocation);
      case 'king':
        return this.isValidKingMove(currentLocation, newLocation);
      default:
        return false;
    }
  }


  isValidPawnMove(currentLocation, newLocation) {
    // If the pawn is black
    if(this.color === 'black') {
    if(currentLocation.row === 1  && newLocation.row === 3 && currentLocation.col === newLocation.col) {
      return true;
    } else if (newLocation.row === currentLocation.row + 1 && newLocation.col === currentLocation.col) {
      return true;
    }
    return false;
    }
    // If the pawn is white
    else{
 
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
  newLocation.row === currentLocation.row + 1 &&
  Math.abs(newLocation.col - currentLocation.col) === 1
) {
  return true; // Black pawn capturing diagonally
}
  }
    // If the pawn is white
  else{

    if (newLocation.row === currentLocation.row - 1 && Math.abs(newLocation.col - currentLocation.col) === 1) {
      return true;
    }
  }
  return false;

  }
  isValidRookMove(currentLocation,newLocation) {
    if( currentLocation.row == newLocation.row || currentLocation.col == newLocation.col) {
      return true;
    }
    return false;
  }
  isValidKnightMove(currentLocation,newLocation) {
    console.log("checking");
    if (
      (Math.abs(currentLocation.row - newLocation.row) === 2 && Math.abs(currentLocation.col - newLocation.col) === 1) ||
      (Math.abs(currentLocation.row - newLocation.row) === 1 && Math.abs(currentLocation.col - newLocation.col) === 2)
    ) {
      
      return true;
    }
    return false;
  }
  isValidBishopMove(currentLocation,newLocation) {
    if (
      Math.abs(currentLocation.row - newLocation.row) === Math.abs(currentLocation.col - newLocation.col)
    ) {
      return true;
    }
    return false;
  }
  isValidQueenMove(currentLocation,newLocation) {
    if (
      this.isValidRookMove(currentLocation, newLocation) ||
      this.isValidBishopMove(currentLocation, newLocation)
    ) {
      return true;
    }
    return false;
  }
  isValidKingMove(currentLocation,newLocation) {
    // Logic specific to king movement
    if (
      Math.abs(currentLocation.row - newLocation.row) <= 1 &&
      Math.abs(currentLocation.col - newLocation.col) <= 1
    ) {
      return true;
    }
    return false;
  }


}

export default  Piece;