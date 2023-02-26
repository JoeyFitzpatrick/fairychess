from typing import List, Dict
from fastapi import WebSocket
from board.Board import Board
from pydantic import BaseModel

class BoardRequest(BaseModel):
    roomId: str
    boardType: str
    length: int
    width: int
    rowsToPopulate: int
    pawnRow: bool

class Room:
    def __init__(self, id: str, board: Board = None):
        self.id = id
        self.board = board
        self.connections = []

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str: Room] = {} 
        
        
    def generate_board(self, req: BoardRequest):
        if req.boardType.lower() == "random_same":
            return Board(req.length, req.width).random_same(req.rowsToPopulate, req.pawnRow)
        
    def get_board(self, req: BoardRequest):
        room_id = req.roomId
        if room_id not in self.rooms:
            self.rooms[room_id] = Room(room_id)
        if not self.rooms[room_id].board:
            self.rooms[room_id].board = self.generate_board(req)
        return self.rooms[room_id].board

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = Room(room_id)
        self.rooms[room_id].connections.append(websocket)

    def disconnect(self, websocket: WebSocket, roomId: str):
        if roomId in self.rooms:
            self.rooms[roomId].connections.remove(websocket)
        if len(self.rooms[roomId].connections) == 0:
            del self.rooms[roomId]

    async def broadcast(self, message: str, roomId: str):
        for connection in self.rooms[roomId].connections:
            await connection.send_text(message)

    async def emit(self, websocket: WebSocket, message: str, roomId: str):
        for connection in self.rooms[roomId].connections:
            if connection != websocket:
                await connection.send_text(message) 
