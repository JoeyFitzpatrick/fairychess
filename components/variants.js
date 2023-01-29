const defaultPieces = [1, 2, 3, 4, 5, 6]

export const boardDefault = [
    [-6, -5, -4, -3, -2, -4, -5, -6],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [6, 5, 4, 3, 2, 4, 5, 6],
]

export const defaultLarger = [
    [0, -6, -5, -4, -3, -2, -4, -5, -6, 0],
    [0, -1, -1, -1, -1, -1, -1, -1, -1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 6, 5, 4, 3, 2, 4, 5, 6, 0],
]

export const defaultSmaller = [
    [-6, -5, -4, -3, -2, -4, -5, -6],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [6, 5, 4, 3, 2, 4, 5, 6],
]

export const defaultRandomSame = randomBothSidesSame(8, 8, defaultPieces, true)

export const newPieceTesting = [
    [-6, -7, -4, -3, -2, -4, -7, -6],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [6, 7, 4, 3, 2, 4, 7, 6],
]

export function randomBothSidesSame(length, width, possiblePieces, usePawnRow) {
    const board = emptyBoard(length, width)
    const rowsToPopulate = defaultRowSelection(length);

    for (let i = 0; i < rowsToPopulate; i++) {
        let row = board[i];
        board[i] = populateRow(row, possiblePieces);
        console.log(populateRow(row, possiblePieces))
    }
    // Populate a row with pawns if needed
    if (usePawnRow) {
        let pawnRow = board[rowsToPopulate - 1]
        board[rowsToPopulate - 1] = populateRow(pawnRow, [1])
    }

    addKingIfNeeded(board);
    makeBlackMatchWhite(board);
    return board;
}

export const variants = {
    "Default": boardDefault,
    "Big Board": defaultLarger,
    "Small Board": defaultSmaller,
    "Default Random Both Sides Same": defaultRandomSame,
    "New Piece Testing Zone": newPieceTesting
}

function emptyBoard(length, width) {
    return Array.from(Array(length), _ => Array(width).fill(0));
}

function defaultRowSelection(length) {
    return Math.floor(length / 3);
}

function selectRandomPiece(possiblePieces) {
    return possiblePieces[Math.floor(Math.random()*possiblePieces.length)];
}

function populateRow(row, possiblePieces) {
    const populatedRow = row.map(square => {
        // refactor this so if possiblePieces is just one piece, skip randomization and just use that piece
        square = selectRandomPiece(possiblePieces)
        return square; 
    })
    return populatedRow;
}

function addKingIfNeeded(partOfBoard) {
    let kingIsPresent = false;
    partOfBoard.forEach(row => {
        if (rowHasKing(row)) {
            kingIsPresent = true;
        }
    })
    
    if (!kingIsPresent) {
        const row = partOfBoard[0];
        const len = row.length;
        const randomKingSquare = getRandomInt(len)
        row[randomKingSquare] = 2
    }
}

function rowHasKing(row) {
    row.forEach(piece => {
        if (piece === 2 || piece === -2) {
            return true;
        }
    })
    return false;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function makeBlackMatchWhite(board) {
    let whiteRow = 0;
    let blackRow = board.length - 1;
    let rowHasPieces = !isRowEmpty(board[0])

    while (rowHasPieces && whiteRow < blackRow) {
        const convertedRow = board[whiteRow].map(piece => piece * -1)
        board[blackRow] = convertedRow;
        whiteRow++;
        blackRow--;
        rowHasPieces = !isRowEmpty(board[whiteRow]);
    }
}

function isRowEmpty(row) {
    const piecesInRow = new Set();
    row.forEach(piece => {piecesInRow.add(piece)})
    const emptyRow = new Set();
    emptyRow.add(0);
    return piecesInRow === emptyRow;
}