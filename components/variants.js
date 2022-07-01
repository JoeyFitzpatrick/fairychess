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

export const variants = {
    "Default": boardDefault,
    "Big Board": defaultLarger,
    "Small Board": defaultSmaller,
    "New Piece Testing Zone": newPieceTesting
}