import { gameId } from "../pages"

export const socket = new WebSocket(`ws://localhost:8000/ws/${gameId}`)
