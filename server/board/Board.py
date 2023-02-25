from board.BoardConstants import piece_numbers as pn, standard_pieces as sp
from board.Row import Row


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
        i = 0
        while True:
            row = self.board[i]
            is_empty = not isinstance(row, Row) or row.is_empty()
            if i >= len(self.board) or is_empty:
                break
            i += 1  
        return i - 1
    
    def append_rows(self, row: Row, num_rows: int = 1):
        for i in range(num_rows):
            self.board.append(row)
        return self
    
    def do_if(self, condition: bool, fn: callable, *fn_params):
        if condition:
            return fn(*fn_params)
        return self
    
    def replace(self, row: Row, row_to_replace: int = -1):
        self.board[row_to_replace] = row
        return self
    
    def append_inverted(self):
        i = self.last_non_empty()
        while i >= 0:
            row = self.board[i]
            self.append_rows(row.invert())
            i -= 1
        return self
    
    def random_same(self, rows_to_populate, use_pawn_row = True, pieces = sp):
        self = self.empty() \
            .append_rows(Row(self.width).random_with_king(pieces)) \
            .append_rows(Row(self.width).random(pieces), rows_to_populate - 1) \
            .do_if(use_pawn_row, self.replace, Row(self.width).fill(pn["pawn"])) \
            .append_rows(Row(self.width).empty(), self.length - rows_to_populate*2).append_inverted()
        return self
        
    

    
# board = generate_board("random_same", 8, 8, 2, True)
# print(board) 
