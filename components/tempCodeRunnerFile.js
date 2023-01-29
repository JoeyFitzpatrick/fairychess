
function emptyBoard(length, width) {
    return Array.from(Array(length), _ => Array(width).fill(0));
}

console.log(emptyBoard(3, 4));