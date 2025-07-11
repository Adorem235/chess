 class piece {
  constructor( color, location) {
    this.color = color; // e.g., 'white' or 'black'
    this.location = location; // e.g., { row: 0, col: 0 }

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

  toString() {
    return `${this.color} ${this.type}`;
  }

  move(newLocation) {
    switch (this.type) {
      case 'pawn':
        if (this.isValidPawnMove(newLocation)) {
          this.setLocation(newLocation);
        } else {
          throw new Error('Invalid pawn move');
        }
        break;
      case 'rook':
        if (this.isValidRookMove(newLocation)) {
          this.setLocation(newLocation);
        } else {
          throw new Error('Invalid rook move');
        }
        break;
      case 'knight':
        if (this.isValidKnightMove(newLocation)) {
          this.setLocation(newLocation);
        } else {
          throw new Error('Invalid knight move');
        }
        break;
      case 'bishop':
        if (this.isValidBishopMove(newLocation)) {
          this.setLocation(newLocation);
        } else {
          throw new Error('Invalid bishop move');
        }
        break;
      case 'queen':
        if (this.isValidQueenMove(newLocation)) {
          this.setLocation(newLocation);
        } else {
          throw new Error('Invalid queen move');
        }
        break;
      case 'king':
        if (this.isValidKingMove(newLocation)) {
          this.setLocation(newLocation);
        } else {
          throw new Error('Invalid king move');
        }
        break;
      default:
        throw new Error('Unknown piece type');
    }
    // Logic to move the piece to a new location
    this.setLocation(newLocation);
  }

  isValidPawnMove(newLocation) {
    // Logic specific to pawn movement
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

export default function Piece(color, type, location) {
  this.color = color; // e.g., 'white' or 'black'
  this.type = type; // e.g., 'pawn', 'rook', etc.
  this.location = location; // e.g., { row: 0, col: 0 }

  this.getColor = function() {
    return this.color;
  };

  this.getType = function() {
    return this.type;
  };

  this.getLocation = function() {
    return this.location;
  };

  this.setLocation = function(newLocation) {
    this.location = newLocation;
  };
}