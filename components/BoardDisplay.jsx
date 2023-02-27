import Image from "next/image";
import React from "react";
import { v4 as uuidv4 } from "uuid";

function getSquareStyle(square) {
  let className = "square";
  square.isLegalSquare ? className += " legalSquare" : null;
  square.isLegalSquare && square.pieceNum ? className += " hasPiece" : null;
  return className;
}

function BoardDisplay({ boardDirectionColor, board, clickSquare }) {
    let themeColor1 = "rgba(240,217,181,255)";
    let themeColor2 = "rgba(181,136,99,255)";
  const boardDisplayWhite = () => {
    return (
      <div className={"outer-container"}>
        <div className="inner-container">
          {board.map((row, i) => {
            return (
              <div key={uuidv4()} className="board-row">
                {row.map((item, j) => {
                  return (
                    <div
                      key={uuidv4()}
                      className={getSquareStyle(item)}
                      onClick={() => clickSquare(item)}
                      style={{
                        backgroundColor:
                          (j + i) % 2 === 0 ? themeColor1 : themeColor2,
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
                            width: `${100 / row.length}%`,
                            maxWidth: "55px",
                          }}
                        >
                          {item.isLegalSquare ? (
                            <span class="dot">&nbsp;</span>
                          ) : null}
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
  if (boardDirectionColor === 1) {
    return boardDisplayWhite();
  }
  if (boardDirectionColor === -1) {
    return boardDisplayBlack();
  }
  return <div>Can&apos;t connect to game...</div>;
}

export default BoardDisplay;
