import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { convertNumToPiece, convertObjToPiece } from './pieces'
import { variants } from './variants'
import { v4 as uuidv4 } from 'uuid';
import io from 'Socket.IO-client'
let socket;

const Board = ({ variant }) => {

    let themeColor1 = "rgba(240,217,181,255)"
    let themeColor2 = "rgba(181,136,99,255)"

    const [board, setBoard] = useState([])
    const [canSelectPiece, setCanSelectPiece] = useState(true)
    const [selectedPiece, setSelectedPiece] = useState(null)
    const [canSelectTarget, setCanSelectTarget] = useState(false)
    const [turnColor, setTurnColor] = useState(1)
    const [isMyTurn, setIsMyTurn] = useState(true)
    const [whiteWins, setWhiteWins] = useState(false)
    const [blackWins, setBlackWins] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [playerColor, setPlayerColor] = useState(1) // white is 1, black is -1
    const [playerQuantity, setPlayerQuantity] = useState()

    useEffect(() => socketInitializer(), [])

    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io()
  
      socket.on('connect', () => {
        console.log('connected')
      })
    }

    const convertBoardFromJSON = (jsonBoard) => {
        if (jsonBoard === [] || !jsonBoard) return []
        const returnBoard = []
        const parsedBoard = JSON.parse(jsonBoard)
        parsedBoard.forEach((row) => {
            const convertedRow = row.map(item => {
                return convertObjToPiece(item)
            })
            returnBoard.push(convertedRow)
        })
        return returnBoard
    }

    const checkGameOver = () => {
        let whiteHasKing = false
        let blackHasKing = false
        for (const row of board) {
            for (const square of row) {
                if (square.isKing && square.color=== 1) {
                    whiteHasKing = true
                }
                if (square.isKing && square.color === -1) {
                    blackHasKing = true
                }
            }
        }
        if (!whiteHasKing) {
            setBlackWins(true)
            setGameOver(true)
        }
        if (!blackHasKing) {
            setWhiteWins(true)
            setGameOver(true)
        }
    }

    const movePiece = (piece, endSquare) => {
        const boardCopy = [...board]
        boardCopy[piece.x][piece.y] = convertNumToPiece(0, piece.x, piece.y)
        piece.updateLocation(endSquare.x, endSquare.y)
        boardCopy[endSquare.x][endSquare.y] = piece
        setBoard(boardCopy)
        checkGameOver()
    }

    const processMove = (piece, endSquare) => {

        socket.emit("move-made", {
            "piece": piece,
            "endSquare": endSquare,
            "turnColor": turnColor * -1
        })

        movePiece(piece, endSquare)
        setCanSelectPiece(true)
        setSelectedPiece(null)
        setCanSelectTarget(false)
        setIsMyTurn(false)
        setTurnColor(turnColor * -1)

        for (const row of board) {
            for (const square of row) {
                square.isLegalSquare = false
            }
        }
    }

    const clickSquare = (piece) => {
        if (playerQuantity === 2) {
            if (!isMyTurn) {return}
        }
        if (gameOver) {return}

        if (canSelectTarget && selectedPiece && selectedPiece.isMoveLegal(board, piece.x, piece.y)) {

            processMove(selectedPiece, piece)
        
        } else if (canSelectPiece && (piece.color === turnColor)) {
            for (const row of board) {
                for (const square of row) {
                    square.isLegalSquare = false
                }
            }
            setSelectedPiece(piece)
            setCanSelectTarget(true)
            if (piece.getLegalSquares(board))
            for (const square of piece.getLegalSquares(board)) {
                board[square[0]][square[1]].isLegalSquare = true
            }

        } else {
            setCanSelectPiece(true)
            setSelectedPiece(null)
            setCanSelectTarget(false)

            for (const row of board) {
                for (const square of row) {
                    square.isLegalSquare = false
                }
            }
        }
    }

    useEffect(() => {
        setBoard(
            variants[variant].map((row, j) => {
                return row.map((item, i) => {
                    return convertNumToPiece(item, j, i)
                })
            })
        )
    }, [])

    useEffect(() => {
        if (socket == null) return

        socket.on('receive-move', (state) => {
            const piece = convertObjToPiece(state.piece)
            movePiece(piece, state.endSquare)
            setCanSelectPiece(true)
            setSelectedPiece(null)
            setCanSelectTarget(false)
            setIsMyTurn(true)
            setTurnColor(state.turnColor)

    
            for (const row of board) {
                for (const square of row) {
                    square.isLegalSquare = false
                }
            }
            
        })
    }, [socket])

    useEffect(() => {
        if (socket == null) return

        socket.on('receive-color', (color) => {
            //setIsMyTurn(turnSwitch)

            if (!playerColor) {
                setPlayerColor(color)
                color === 1 ? setIsMyTurn(true) : setIsMyTurn(false)
            }
        })
    }, [socket, playerColor])

    useEffect(() => {
        if (socket == null) return

        socket.on('player-quantity', (obj) => {
            setPlayerQuantity(obj.quantity)
        })
    }, [socket])

    // useEffect(() => {
    //     if (window.sessionStorage.getItem('board')) {
    //     setBoard(convertBoardFromJSON(window.sessionStorage.getItem('board')));
    //     setTurnColor(JSON.parse(window.sessionStorage.getItem('turnColor')));
    //     setIsMyTurn(JSON.parse(window.sessionStorage.getItem('isMyTurn')));
    //     setWhiteWins(JSON.parse(window.sessionStorage.getItem('whiteWins')));
    //     setBlackWins(JSON.parse(window.sessionStorage.getItem('blackWins')));
    //     setGameOver(JSON.parse(window.sessionStorage.getItem('gameOver')));
    //     setPlayerColor(JSON.parse(window.sessionStorage.getItem('playerColor')));
    //     setPlayerQuantity(JSON.parse(window.sessionStorage.getItem('playerQuantity')));
    //     }
    // }, []);

    // useEffect(() => {
    //     window.sessionStorage.setItem('board', (JSON.stringify(board)));
    //     window.sessionStorage.setItem('turnColor', turnColor);
    //     window.sessionStorage.setItem('isMyTurn', isMyTurn);
    //     window.sessionStorage.setItem('whiteWins', whiteWins);
    //     window.sessionStorage.setItem('blackWins', blackWins);
    //     window.sessionStorage.setItem('gameOver', gameOver);
    //     window.sessionStorage.setItem('playerColor', playerColor);
    //     window.sessionStorage.setItem('playerQuantity', playerQuantity);
    // }, [board, turnColor, isMyTurn, whiteWins, blackWins, gameOver, playerColor, playerQuantity]);

    const boardDisplayWhite = () => {
        return (
            <div className={"outer-container flex justify-center"}>
            {gameOver && <div>Game is over</div>}
            {whiteWins && <div>White wins</div>}
            {blackWins && <div>Black wins</div>}
            <div className="inner-container">
                {board.map((row, i) => {
                return <div key={uuidv4()} className="row w-full flex">
                    {row.map((item, j) => {
                        return <div key={uuidv4()} className="square w-12 h-12 md:w-16 md:h-16" onClick={() => clickSquare(item)}
                                style={{
                                    backgroundColor: (j + i) % 2 === 0 ? themeColor1 : themeColor2,
                                    border: item.isLegalSquare && "2px solid green"
                                    }}>
                            {item.pieceNum ? <Image src={"/" + item.imageUrl} alt={`Chess piece, id is ${item.imageUrl}`} height="60px" width="60px" /> : null}
                        </div>
                    })}
                </div>
                })}
            </div>
        </div>
        )
    }

    const boardDisplayBlack = () => {
        return (
            <div className={"outer-container"}>
            {gameOver && <div>Game is over</div>}
            {whiteWins && <div>White wins</div>}
            {blackWins && <div>Black wins</div>}
            <div className="inner-container">
                {board.slice(0).reverse().map((row, i) => {
                return <div key={uuidv4()} className="row w-full flex">
                    {row.slice(0).reverse().map((item, j) => {
                        return <div key={uuidv4()} className="square w-12 h-12 md:w-16 md:h-16" onClick={() => clickSquare(item)}
                                style={{
                                    backgroundColor: (j + i) % 2 === 0 ? themeColor1 : themeColor2,
                                    border: item.isLegalSquare && "2px solid green"
                                    }}>
                            {item.pieceNum ? <Image className="h-full" src={"/" + item.imageUrl} alt={`Chess piece, id is ${item.imageUrl}`} height="60px" width="60px" /> : null}
                        </div>
                    })}
                </div>
                })}
            </div>
        </div>
        )
    }

    if (playerColor === 1) {return boardDisplayWhite()}
    if (playerColor === -1) {return boardDisplayBlack()}
    return <div>Not connected to server</div>
}

export default Board
