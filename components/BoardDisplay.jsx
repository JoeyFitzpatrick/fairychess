import React from "react";
import { v4 as uuidv4 } from "uuid";
import PieceImage from "./PieceImage";

function getSquareStyle(square) {
  let className = "square";
  square.isLegalSquare ? className += " legalSquare" : null;
  square.isLegalSquare && square.pieceNum ? className += " hasPiece" : null;
  return className;
}

function allowDrop(e) {
  e.preventDefault();
  e && e.dataTransfer ? e.dataTransfer.dropEffect = "move" : null;
}

function BoardDisplay({ boardDirectionColor, board, selectSquare }) {
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
                      onMouseDown={() => selectSquare(item)}
                      onDrop={() => selectSquare(item)}
                      // todo: add outline to hovered square
                      onDragOver={() => allowDrop(event)}
                      style={{
                        backgroundColor:
                          (j + i) % 2 === 0 ? themeColor1 : themeColor2,
                        width: `${100 / row.length}%`,
                        maxWidth: "55px",
                      }}
                    >
                      {item.pieceNum ? (
                        <PieceImage item={item} onDragStart={() => selectSquare(item)}/>
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
                          className={getSquareStyle(item)}
                          onMouseDown={() => selectSquare(item)}
                          onDrop={() => selectSquare(item)}
                          onDragOver={() => allowDrop(event)}
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
                            <PieceImage item={item} onDragStart={() => selectSquare(item)}/>
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
