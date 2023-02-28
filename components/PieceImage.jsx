import React, { useState } from 'react'
import Image from "next/image";

function PieceImage({ item, onDragStart }) {
   
    const pieceUrl = "/" + item.imageUrl
    const invisibleUrl = "/invisible.png"
    const [imgUrl, setImgUrl] = useState(pieceUrl)

  return (
    <Image
      className="piece-img"
      src={imgUrl}
      alt={`Chess piece, id is ${item.imageUrl}`}
      height="50"
      width="50"
      draggable={true}
      onDragStart={() => {onDragStart; setImgUrl(invisibleUrl)}}
      onDragEnd={() => {setImgUrl(pieceUrl)}}
    />
  )
}

export default PieceImage