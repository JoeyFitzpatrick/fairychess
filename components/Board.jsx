import Image from "next/image";
import React, { useState, useEffect } from "react";
import { convertNumToPiece, convertObjToPiece } from "./pieces";
import { variants } from "./variants";
import { v4 as uuidv4 } from "uuid";
import { useChannel } from "./AblyReactEffect";
import Button from "react-bootstrap/Button";

const Board = ({ variant, gameId, numPlayers }) => {
  let themeColor1 = "rgba(240,217,181,255)";
  let themeColor2 = "rgba(181,136,99,255)";

  const [board, setBoard] = useState([]);
  const [canSelectPiece, setCanSelectPiece] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [canSelectTarget, setCanSelectTarget] = useState(false);
  const [turnColor, setTurnColor] = useState(1);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [whiteWins, setWhiteWins] = useState(false);
  const [blackWins, setBlackWins] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerColor, setPlayerColor] = useState(); // white is 1, black is -1
  const [connectionIds, setConnectionIds] = useState([]);

  const [channel, ably] = useChannel(gameId, (message) => {
    if (message.name === "init") {
      setConnectionIds([...connectionIds, message.connectionId]);
      console.log("connectionId from init:", message.connectionId);
      console.log("array of ids:", connectionIds);
    } else {
      const data = message.data;
      const piece = convertObjToPiece(data.piece);
      movePiece(piece, data.endSquare);
      setCanSelectPiece(true);
      setSelectedPiece(null);
      setCanSelectTarget(false);
      setIsMyTurn(true);
      setTurnColor(data.turnColor);

      for (const row of board) {
        for (const square of row) {
          square.isLegalSquare = false;
        }
      }
    }
  });

  const sendMoveMessage = (state) => {
    channel.publish({ name: "send-move", data: state });
  };

  const sendInitMessage = (msg) => {
    // let numUsers
    // channel.presence.get(function(err, members) {
    //   if(err) { return console.error("Error fetching presence data"); }
    //   numUsers = members.length;
    // });
    channel.publish({ name: "init", data: "Init received" });
  };

  useEffect(() => {
    setBoard(
      variants[variant].map((row, j) => {
        return row.map((item, i) => {
          return convertNumToPiece(item, j, i);
        });
      })
    );
    sendInitMessage("Init sent");
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
    sendMoveMessage({
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

  const clickSquare = (piece) => {
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

  const boardDisplayWhite = () => {
    return (
      <div className={"outer-container"}>
        {gameOver && <div>Game is over</div>}
        {whiteWins && <div>White wins</div>}
        {blackWins && <div>Black wins</div>}
        <div className="inner-container">
          {board.map((row, i) => {
            return (
              <div key={uuidv4()} className="board-row">
                {row.map((item, j) => {
                  return (
                    <div
                      key={uuidv4()}
                      className="square"
                      onClick={() => clickSquare(item)}
                      style={{
                        backgroundColor:
                          (j + i) % 2 === 0 ? themeColor1 : themeColor2,
                        border: item.isLegalSquare && "2px solid green",
                        width: `${100 / row.length}%`,
                        maxWidth: "55px",
                      }}
                    >
                      {item.pieceNum ? (
                        <Image
                          className="piece-img"
                          src={"/" + item.imageUrl}
                          alt={`Chess piece, id is ${item.imageUrl}`}
                          height="50"
                          width="50"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const boardDisplayBlack = () => {
    return (
      <div className={"outer-container"}>
        {gameOver && <div>Game is over</div>}
        {whiteWins && <div>White wins</div>}
        {blackWins && <div>Black wins</div>}
        <div className="inner-container">
          {board
            .slice(0)
            .reverse()
            .map((row, i) => {
              return (
                <div key={uuidv4()} className="board-row">
                  {row
                    .slice(0)
                    .reverse()
                    .map((item, j) => {
                      return (
                        <div
                          key={uuidv4()}
                          className="square"
                          onClick={() => clickSquare(item)}
                          style={{
                            backgroundColor:
                              (j + i) % 2 === 0 ? themeColor1 : themeColor2,
                            border: item.isLegalSquare && "2px solid green",
                            width: `${100 / row.length}%`,
                            maxWidth: "55px",
                          }}
                        >
                          {item.pieceNum ? (
                            <Image
                              className="piece-img"
                              src={"/" + item.imageUrl}
                              alt={`Chess piece, id is ${item.imageUrl}`}
                              height="50"
                              width="50"
                            />
                          ) : null}
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  if (playerColor === 1) {
    return boardDisplayWhite();
  }
  if (playerColor === -1) {
    return boardDisplayBlack();
  }
  return (
    <div>
      <h3>Select color</h3>
      <Button
        onClick={() => {
          setPlayerColor(1);
          setIsMyTurn(true);
        }}
      >
        White
      </Button>
      <Button
        onClick={() => {
          setPlayerColor(-1);
          setIsMyTurn(false);
        }}
      >
        Black
      </Button>
    </div>
  );
};

export default Board;