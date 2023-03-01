import React from 'react'
import Image from "next/image";

// todo: look into making dragged piece not "ghosted". maybe check this out: https://stackoverflow.com/questions/9712535/html5-drag-and-drop-no-transparency

function PieceImage({ item, onDragStart }) {

    const handleDragStart = (e) => {
        setTimeout(() => {
            e.target.style.visibility = "hidden"
        }, 1);
    }
    
    const handleDragEnd = (e) => {
        e.target.style.visibility = ""
    }

  return (
    <Image
      className="piece-img"
      src={"/" + item.imageUrl}
      alt={`Chess piece, id is ${item.imageUrl}`}
      height="50"
      width="50"
      draggable={true}
      // Todo: see if a 0.1s timeout will cause correct image to be dragged
      onDragStart={() => {onDragStart; handleDragStart(event)}}
      onDragEnd={() => {handleDragEnd(event)}}
    />
  )
}

export default PieceImage