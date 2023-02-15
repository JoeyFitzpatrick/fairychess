import random
from typing import List
from BoardConstants import piece_numbers


def empty_board(length: int, width: int):
    board = []
    for i in range(length):
        row = []
        for j in range(width):
            row.append(0)
        board.append(row)
    return board


def is_empty(row: List[int]):
    return all(piece == 0 for piece in row)


def first_empty_row_index(board: List[List[int]]):
    i = 0
    while not is_empty(board[i]) and i < len(board):
        i += 1
    if is_empty(board[i]):
        return i
    return None


def random_piece(pieces: List[int], color=1):
    return random.choice(pieces) * color


def randomize_empty_row(board: List[List[int]], pieces_to_use: List[int]):
    # Find the first empty row and replace it with row of randomized pieces
    row_index = first_empty_row_index(board)
    if row_index != None:
        row = [random_piece(pieces_to_use) for piece in board[row_index]]
        board[row_index] = row
        print(row)
        # for square in board[row_index]:
        # square = random_piece(pieces_to_use)
    return board


def fill_empty_row(board, piece: int):
    row_index = first_empty_row_index(board)
    if row_index != None:
        board[row_index] = [piece for square in board[row_index]]
    return board


def flip_row_color(row):
    row = [piece * -1 for piece in row]
    return row


def black_match_white(board):
    first = 0
    last = len(board) - 1
    while not is_empty(board[first]) and first < last:
        board[last] = flip_row_color(board[first])
        first += 1
        last -= 1
    return board


def random_both_sides_same(board, num_rows_to_populate: int, pieces: List[int], use_pawn_row: bool = True):
    for i in range(num_rows_to_populate):
        board = randomize_empty_row(board, pieces)
    # still need to add king if it isn't there
    if use_pawn_row:
        board = fill_empty_row(board, piece_numbers["pawn"])
    board = black_match_white(board)
    print(board)
    return board


board = empty_board(8, 8)
board = random_both_sides_same(board, 1, [1, 2, 3, 4, 5], True)
print(board)
