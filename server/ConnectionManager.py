from typing import List, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str: List[WebSocket]] = {} 

    async def connect(self, websocket: WebSocket, roomId: str):
        await websocket.accept()
        if roomId not in self.rooms:
            self.rooms[roomId] = []
        self.rooms[roomId].append(websocket)

    def disconnect(self, websocket: WebSocket, roomId: str):
        if roomId in self.rooms:
            self.rooms[roomId].remove(websocket)

    async def broadcast(self, message: str, roomId: str):
        for connection in self.rooms[roomId]:
            await connection.send_text(message)

    async def emit(self, websocket: WebSocket, message: str, roomId: str):
        for connection in self.rooms[roomId]:
            if connection != websocket:
                await connection.send_text(message) 
