from typing import List
from board.BoardConstants import piece_numbers as pn, standard_pieces as sp, layouts
from board.Row import Row
# from pydantic import BaseModel
# from BoardConstants import piece_numbers as pn, standard_pieces as sp
# from Row import Row


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
    
    def last_non_empty(self) -> int:
        i = len(self.board) - 1
        while True:
            row = self.board[i]
            is_empty = not isinstance(row, Row) or row.is_empty()
            if i <= 0 or is_empty:
                break
            i -= 1  
        return i + 1
    
    def push_rows(self, row: Row, num_rows: int = 1):
        for i in range(num_rows):
            self.board.insert(0, row)
        return self
    
    def do_if(self, condition: bool, fn: callable, *fn_params):
        if condition:
            return fn(*fn_params)
        return self
    
    def replace(self, row: Row, row_to_replace: int = 0):
        self.board[row_to_replace] = row
        return self
    
    def push_inverted(self):
        i = self.last_non_empty()
        while i <= len(self.board) - 1:
            row = self.board[i]
            self.push_rows(row.invert())
            i += 2
        return self
        
    def hardcoded(self, input_board: List[List[int]]):
        self.board = []
        for row in input_board:
            self.board.append(Row().hardcoded(row))
        return self
    
    def random_same(self, rows_to_populate, use_pawn_row = True, pieces = sp):
        self = self.empty() \
            .push_rows(Row(self.width).random_with_king(pieces)) \
            .push_rows(Row(self.width).random(pieces), rows_to_populate - 1) \
            .do_if(use_pawn_row, self.replace, Row(self.width).fill(pn["pawn"])) \
            .push_rows(Row(self.width).empty(), self.length - rows_to_populate*2) \
            .push_inverted()
        return self
        
    def from_layout(self, layout: str):
        return self.hardcoded(layouts[layout])
    

    
# board = Board().from_layout("default_larger")
# print(board)

# class MoveRequest(BaseModel):
#     messageType: str
#     piece: object
#     endSquare: object
