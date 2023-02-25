from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ConnectionManager import ConnectionManager
from pydantic import BaseModel
from board.Board import Board

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

manager = ConnectionManager()

async def handler(websocket, path):
    data = await websocket.recv()
    await websocket.send(data)

@app.websocket("/ws/{room_id}")
# TODO: implement request body so that request to join room also provides params to create board
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    # board = generate_board(add params here)
    # await manager.connect(websocket, room_id, board)
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            msg = data
            await manager.emit(websocket, msg, room_id)
            # await manager.broadcast(msg, room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        await manager.broadcast(f"A player left the game", room_id)
        
        
class BoardRequest(BaseModel):
    roomId: str
    boardType: str
    length: int
    width: int
    boardParams: dict

@app.post("/board/")
async def get_board(req: BoardRequest):
    board = generate_board(req.boardType, req.length, req.width, 2)
    return board

def generate_board(board_type: str, length: int, width: int, *board_params):
    if board_type.lower() == "random_same":
        return Board(length, width).random_same(*board_params)