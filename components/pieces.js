export const convertNumToPiece = (pieceNum, x, y) => {
    switch (pieceNum) {
        case 0:
            return new Empty(x, y)
        
        case 1:
            return new Pawn(x, y, true)
        
        case -1:
            return new Pawn(x, y, false)
        
        case 2:
            return new King(x, y, true)
        
        case -2:
            return new King(x, y, false)
        
        case 3:
            return new Queen(x, y, true)
        
        case -3:
            return new Queen(x, y, false)
        
        case 4:
            return new Bishop(x, y, true)
        
        case -4:
            return new Bishop(x, y, false)
        
        case 5:
            return new Knight(x, y, true)
        
        case -5:
            return new Knight(x, y, false)
        
        case 6:
            return new Rook(x, y, true)
        
        case -6:
            return new Rook(x, y, false)

        case 7:
            return new Nightrider(x, y, true)
        
        case -7:
            return new Nightrider(x, y, false)
        
        default:
            return "Error: piece number not defined"
    }

}

export const convertObjToPiece = (obj) => {
    const piece = convertNumToPiece(obj.pieceNum, obj.x, obj.y)
    piece.isKing = obj.isKing
    if (piece.pieceNum === 1) {
        piece.isFirstMove = obj.isFirstMove
    }
    return piece
}

class Piece {
    constructor(x, y, isWhite) {
        this.x = x
        this.y = y
        if (isWhite) {
            this.color = 1
            this.colorCode = "w"
        } else {
            this.color = -1
            this.colorCode = "b"
        }
        this.possibleX = []
        this.possibleY = []
        this.isLegalSquare = false
        this.isKing = false
    }

    updateLocation(x, y) {
        this.x = x
        this.y = y
    }

    getLegalSquares(boardState) {
        const legalSquares = []

        for (let i = 0; i < this.possibleX.length; i++) {
            for (let j = 1; j < boardState.length; j++) {
                const pathX = this.x + (this.possibleX[i] * j)
                const pathY = this.y + (this.possibleY[i] * j)

                if (pathX < 0 || pathX > boardState.length-1 || pathY < 0 || pathY > boardState[0].length-1) {
                    break
                }

                const pathSquare = boardState[pathX][pathY]

                if (pathSquare.color === 0) {
                    legalSquares.push([pathX, pathY])
                    continue
                }

                if (pathSquare.color === this.color) {
                    break
                }

                if (pathSquare.color === (this.color * -1)) {
                    legalSquares.push([pathX, pathY])
                    break
                }
            }
        }
        return legalSquares
    }

    isMoveLegal(boardState, targetX, targetY) {
        if (this.getLegalSquares(boardState)) {
            for (const item of this.getLegalSquares(boardState)) {
                if (item[0] === targetX && item[1] === targetY)
                return true
            }
        }
        return false
    }
}

class Empty {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.pieceNum = 0
        this.color = 0
    }
}

class Rook extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.pieceNum = 6 * this.color
        this.imageUrl = this.colorCode + "R.svg"
        this.possibleX = [1, -1, 0, 0]
        this.possibleY = [0, 0, 1, -1]
    }
}

class Knight extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.pieceNum = 5 * this.color
        this.imageUrl = this.colorCode + "N.svg"
    }

    getLegalSquares(boardState) {
        const possibleX = [1, 1, -1, -1, 2, 2, -2, -2]
        const possibleY = [2, -2, 2, -2, 1, -1, 1, -1]

        const legalSquares = []
        for (let i = 0; i < possibleX.length; i++) {
            const pathX = this.x + possibleX[i]
            const pathY = this.y + possibleY[i]
            
            if (pathX < 0 || pathX > boardState.length-1 || pathY < 0 || pathY > boardState[0].length-1) {
                continue
            }

            if (boardState[pathX][pathY].color !== this.color) {
                legalSquares.push([pathX, pathY])
            }
        }
        return legalSquares
    }
}

class Bishop extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.pieceNum = 4 * this.color
        this.imageUrl = this.colorCode + "B.svg"
        this.possibleX = [1, -1, 1, -1]
        this.possibleY = [1, 1, -1, -1]
    }
}

class Queen extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.pieceNum = 3 * this.color
        this.imageUrl = this.colorCode + "Q.svg"
        this.possibleX = [1, -1, 1, -1, 1, -1, 0, 0]
        this.possibleY = [1, 1, -1, -1, 0, 0, 1, -1]
    }
}

class King extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.pieceNum = 2 * this.color
        this.imageUrl = this.colorCode + "K.svg"
        this.isKing = true
    }

    getLegalSquares(boardState) {
        const possibleX = [1, -1, 1, -1, 1, -1, 0, 0]
        const possibleY = [1, 1, -1, -1, 0, 0, 1, -1]

        const legalSquares = []
        for (let i = 0; i < possibleX.length; i++) {
            const pathX = this.x + possibleX[i]
            const pathY = this.y + possibleY[i]
            
            if (pathX < 0 || pathX > boardState.length-1 || pathY < 0 || pathY > boardState[0].length-1) {
                continue
            }

            if (boardState[pathX][pathY].color !== this.color) {
                legalSquares.push([pathX, pathY])
            }
        }
        return legalSquares
    }
}

class Pawn extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.pieceNum = 1 * this.color
        this.imageUrl = this.colorCode + "p.svg"
        this.isFirstMove = true
    }

    // consider moving this into piece class
    squareInBoard(boardState, x, y) {
        if (!(x < 0 || x > boardState.length-1 || y < 0 || y > boardState[0].length-1)) {
            return true
        }
        return false
    }

    getLegalSquares(boardState) {
        const legalSquares = []

        // This would be more clear by making local variable in place of this.x - (1 * this)

        if (this.squareInBoard(boardState, this.x - (1 * this.color), this.y) &&
            boardState[this.x - (1 * this.color)][this.y].color === 0) {
            legalSquares.push([this.x - (1 * this.color), this.y])
        }

        if (this.isFirstMove) {
            if (this.squareInBoard(boardState, this.x - (2 * this.color), this.y) &&
            boardState[this.x - (2 * this.color)][this.y].color === 0 && 
            boardState[this.x - (1 * this.color)][this.y].color === 0) {
                legalSquares.push([this.x - (2 * this.color), this.y])
            }
        }



        if (this.squareInBoard(boardState, this.x - (1 * this.color), this.y - (1 * this.color)) &&
            boardState[this.x - 1 * this.color][this.y - (1 * this.color)].color === this.color * -1) {
            legalSquares.push([this.x - (1 * this.color), this.y - (1 * this.color)])
        }

        if (this.squareInBoard(boardState, this.x - (1 * this.color), this.y + (1 * this.color)) &&
            boardState[this.x - 1 * this.color][this.y + (1 * this.color)].color === this.color * -1) {
            legalSquares.push([this.x - (1 * this.color), this.y + (1 * this.color)])
        }
        return legalSquares

    }

    isMoveLegal(boardState, targetX, targetY) {
        if (targetX === this.x - (1 * this.color) && targetY === this.y && boardState[targetX][targetY].color === 0) {
            this.isFirstMove = false
            return true
        }

        if (targetX === this.x - (2 * this.color) && targetY === this.y && 
            boardState[targetX][targetY].color === 0 && 
            boardState[targetX + this.color][targetY].color === 0 && this.isFirstMove) {
            this.isFirstMove = false
            return true
        }

        if (targetX === this.x - (1 * this.color) && 
            (targetY === this.y - (1 * this.color) || targetY === this.y + (1 * this.color)) && 
            boardState[targetX][targetY].color === (this.color * -1)) {
            this.isFirstMove = false
            return true
        }

        return false
    }
}

class Nightrider extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite)
        this.pieceNum = 7 * this.color
        this.imageUrl = this.colorCode + "NR.svg"
        this.possibleX = [1, 1, -1, -1, 2, 2, -2, -2]
        this.possibleY = [2, -2, 2, -2, 1, -1, 1, -1]
    }
}