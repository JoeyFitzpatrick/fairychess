import random
from typing import List
from BoardConstants import piece_numbers as pn, standard_pieces as sp
from Row import Row

        

class Board:
    def __init__(self, length = 8, width = 8):
        self.board = []
        self.length = length
        self.width = width
    
    def __repr__(self):
        return str(self.board)
    
    def empty(self):
        self.board = []
        return self
    
    def append_rows(self, row: Row, num_rows: int = 1):
        for i in range(num_rows):
            self.board.append(row)
        return self
    
    def replace(self, row: Row, row_to_replace: int = -1):
        self.board[row_to_replace] = row
        return self
    
    def append_inverted(self):
        for row in self.board:
            if row.is_empty():
                break
            self.board.append(row.invert())
        return self
    
    def random_same(self, rows_to_populate, use_pawn_row = True, pieces = sp):
        self = self.empty().append_rows(Row(self.width).random_with_king(pieces)).append_rows(Row(self.width).random(pieces), rows_to_populate - 1)
        if use_pawn_row: 
            self = self.replace(Row(self.width).fill(pn["pawn"]))
        self = self.append_rows(Row(self.width).empty(), self.length - rows_to_populate*2).append_inverted()
        return self
        
    

    
board = Board().random_same(2)
print(board)
    
