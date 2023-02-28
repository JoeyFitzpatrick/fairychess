import Image from "next/image";
import React, { useState, useEffect } from "react";
import { convertNumToPiece, convertObjToPiece } from "./pieces";
import { variants } from "./variants";
import { v4 as uuidv4 } from "uuid";
import CountdownTimer from "./timer/CountdownTimer";
import BoardDisplay from "./BoardDisplay";
import { switchColor } from "../utils/switchColor";

const Board = ({ variant, numPlayers, gameId, initialBoard }) => {

  const [socket, setSocket] = useState()  
  
  useEffect(() => {
    setSocket(new WebSocket(`ws://localhost:8000/ws/${gameId}`))
  }, [gameId])

  
  const now = new Date().getTime();
  const later = 60 * 1000;
  const time = now + later;
  
  function findPieceOrSquare(jsonPiece) {
    const possiblePiece = board[jsonPiece.x][jsonPiece.y]
    if (possiblePiece.color === jsonPiece.color && possiblePiece.pieceNum === jsonPiece.pieceNum) {
      return possiblePiece
    }
    return null
  }

  if (socket) {
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      if (data.type === 'move') {
        const piece = findPieceOrSquare(data.piece)
        const square = findPieceOrSquare(data.endSquare)
        movePiece(piece, square)
      } else {
      }
    }
  }



  const [board, setBoard] = useState([]);
  const [canSelectPiece, setCanSelectPiece] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [canSelectTarget, setCanSelectTarget] = useState(false);
  const [turnColor, setTurnColor] = useState(1);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [whiteWins, setWhiteWins] = useState(false);
  const [blackWins, setBlackWins] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerColor, setPlayerColor] = useState(1); // white is 1, black is -1
  const [boardDirectionColor, setBoardDirectionColor] = useState(playerColor) // Board direction, separate from player's color
  
  function sendMove(msg) {
    const msgAsJson = JSON.stringify(msg)
    socket.send(msgAsJson);
  }

  useEffect(() => {
    setBoard(
      initialBoard.map((row, j) => {
        return row.map((item, i) => {
          return convertNumToPiece(item, j, i);
        });
      })
    );
    // sendInitMessage("Init sent");
  }, []);

  const convertBoardFromJSON = (jsonBoard) => {
    if (jsonBoard === [] || !jsonBoard) return [];
    const returnBoard = [];
    const parsedBoard = JSON.parse(jsonBoard);
    parsedBoard.forEach((row) => {
      const convertedRow = row.map((item) => {
        return convertObjToPiece(item);
      });
      returnBoard.push(convertedRow);
    });
    return returnBoard;
  };

  const checkGameOver = () => {
    let whiteHasKing = false;
    let blackHasKing = false;
    for (const row of board) {
      for (const square of row) {
        if (square.isKing && square.color === 1) {
          whiteHasKing = true;
        }
        if (square.isKing && square.color === -1) {
          blackHasKing = true;
        }
      }
    }
    if (!whiteHasKing) {
      setBlackWins(true);
      setGameOver(true);
    }
    if (!blackHasKing) {
      setWhiteWins(true);
      setGameOver(true);
    }
  };

  const movePiece = (piece, endSquare) => {
    const boardCopy = [...board];
    boardCopy[piece.x][piece.y] = convertNumToPiece(0, piece.x, piece.y);
    piece.updateLocation(endSquare.x, endSquare.y);
    boardCopy[endSquare.x][endSquare.y] = piece;
    setBoard(boardCopy);
    checkGameOver();
  };

  const processMove = (piece, endSquare) => {
    sendMove({
      type: 'move',
      piece: piece,
      endSquare: endSquare,
      turnColor: turnColor * -1,
    });

    movePiece(piece, endSquare);
    setCanSelectPiece(true);
    setSelectedPiece(null);
    setCanSelectTarget(false);
    setIsMyTurn(false);
    setTurnColor(turnColor * -1);

    for (const row of board) {
      for (const square of row) {
        square.isLegalSquare = false;
      }
    }
  };

  const selectSquare = (piece, e) => {
    if (numPlayers === "2") {
      if (!isMyTurn) {
        return;
      }
      if (turnColor !== playerColor) {
        return;
      }
    }
    if (gameOver) {
      return;
    }

    if (
      canSelectTarget &&
      selectedPiece &&
      selectedPiece.isMoveLegal(board, piece.x, piece.y)
    ) {
      processMove(selectedPiece, piece);
    } else if (canSelectPiece && piece.color === turnColor) {
      for (const row of board) {
        for (const square of row) {
          square.isLegalSquare = false;
        }
      }
      setSelectedPiece(piece);
      setCanSelectTarget(true);
      if (piece.getLegalSquares(board))
        for (const square of piece.getLegalSquares(board)) {
          board[square[0]][square[1]].isLegalSquare = true;
        }
    } else {
      setCanSelectPiece(true);
      setSelectedPiece(null);
      setCanSelectTarget(false);

      for (const row of board) {
        for (const square of row) {
          square.isLegalSquare = false;
        }
      }
    }
  };

  return (
    <>
        <BoardDisplay boardDirectionColor={boardDirectionColor} board={board} selectSquare={selectSquare} />
        <button onClick={() => setBoardDirectionColor(switchColor(boardDirectionColor))}>Flip Board</button>
    </>
)
};

export default Board;