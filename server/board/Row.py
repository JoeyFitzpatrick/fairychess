import random
from typing import List
from board.BoardConstants import piece_numbers, standard_pieces
# from BoardConstants import piece_numbers, standard_pieces

class Row:
    def __init__(self, width = None) -> None:
        self.row = []
        self.width = width
    
    def __repr__(self) -> str:
        return str(self.row) + "\n"
    
    def empty(self):
        self.row = [0 for i in range(self.width)]
        return self
    
    def is_empty(self):
        return set(self.row) == set([0])
    
    def random(self, pieces: List[int]):
        self.row = [random.choice(pieces) for i in range(self.width)]
        return self
    
    def random_with_king(self, pieces: List[int]):
        self.row = [random.choice(pieces) for i in range(self.width)]
        if piece_numbers["king"] not in self.row:
            self.row[random.randint(0, self.width - 1)] = piece_numbers["king"]
        return self
        
    def fill(self, piece: int):
        self.row = [piece for i in range(self.width)]
        return self
    
    def invert(self):
        # Clean this up, this is disgusting lol
        row = Row(self.width)
        inverted = [piece * -1 for piece in self.row]
        row.row = inverted
        return row
        
    def hardcoded(self, input_row: List[int]):
        self.row = input_row
        return self