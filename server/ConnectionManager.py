import json
from typing import Union, Dict
from fastapi import WebSocket
from board.Board import Board
from board.BoardConstants import layouts, piece_numbers
from pydantic import BaseModel
import threading

class BoardRequest(BaseModel):
    roomId: Union[str, None]
    boardType: Union[str, None]
    length: Union[int, None]
    width: Union[int, None]
    rowsToPopulate: Union[int, None]
    pawnRow: Union[bool, None]
    
class MoveRequest(BaseModel):
    pass

class Room:
    def __init__(self, id: str, board: Board = None):
        self.id = id
        self.board = board
        self.connections = []

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str: Room] = {} 
    
        
    def generate_board(self, req: BoardRequest):
        if req.boardType in layouts.keys():  
            return Board().from_layout(req.boardType)
        elif req.boardType.lower() == "random_same":
            return Board(req.length, req.width).random_same(req.rowsToPopulate, req.pawnRow)
        
    def get_board(self, req: BoardRequest):
        room_id = req.roomId
        if room_id not in self.rooms:
            self.rooms[room_id] = Room(room_id)
        if not self.rooms[room_id].board:
            self.rooms[room_id].board = self.generate_board(req)
        return repr(self.rooms[room_id].board)
        
    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = Room(room_id)
        self.rooms[room_id].connections.append(websocket)

    def disconnect(self, websocket: WebSocket, roomId: str):
        if roomId in self.rooms:
            self.rooms[roomId].connections.remove(websocket)
        if len(self.rooms[roomId].connections) == 0:
            self.remove_room(roomId)
   
    def remove_room(self, roomId: str):
        event = threading.Event()

        def wait_and_delete():
            event.wait(300)
            if self.rooms[roomId] and len(self.rooms[roomId].connections) == 0:
                del self.rooms[roomId]
            event.set()
            
        threading.Thread(target=wait_and_delete).start()


    async def broadcast(self, message: str, roomId: str):
        if roomId in self.rooms and self.rooms[roomId].connections:
            for connection in self.rooms[roomId].connections:
                await connection.send_text(message)

    async def emit(self, websocket: WebSocket, message: str, roomId: str):
        for connection in self.rooms[roomId].connections:
            if connection != websocket:
                await connection.send_text(message) 
    
    def handle_message(self, msg: str, room_id: str):
        move_req = json.loads(msg)
        if 'type' in move_req and move_req['type'] == 'move':
            piece = move_req['piece']
            destination = move_req['endSquare']
            board = self.rooms[room_id].board
            turn_color = move_req['turnColor']
            self.process_move(piece, destination, turn_color, board)
            print(move_req)


    def process_move(self, piece, destination, turn_color, board: Board):
        start_x = piece['x']
        start_y = piece['y']
        dest_x = destination['x']
        dest_y = destination['y']

        board.process_move(piece['pieceNum'], start_x, start_y, dest_x, dest_y, turn_color)
