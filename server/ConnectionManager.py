from typing import List, Dict
from fastapi import WebSocket
from board.Board import Board

class Room:
    def __init__(self, id: str, board: Board):
        self.id = id
        self.board = board
        self.connections = []

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str: Room] = {} 
        
        
    def get_board(self, board_params: dict) -> Board:
        if self.board:
            return self.board
        self.board = Board(board_params)

    async def connect(self, websocket: WebSocket, roomId: str, board: Board):
        await websocket.accept()
        if roomId not in self.rooms:
            self.rooms[roomId] = Room(roomId, board)
        self.rooms[roomId].connections.append(websocket)

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
