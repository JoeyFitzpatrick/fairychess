from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from ConnectionManager import ConnectionManager, BoardRequest

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:8000",
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
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            msg = data
            await manager.emit(websocket, msg, room_id)
            # await manager.broadcast(msg, room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
        # await manager.broadcast(f"A player left the game", room_id)
        
        

@app.post("/board/")
async def get_board(req: BoardRequest):
    print(req)
    return manager.get_board(req)
