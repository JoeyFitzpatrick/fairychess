import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import TopNav from "../../components/TopNav";
import { useState, useEffect } from "react";

const Board = dynamic(() => import("../../components/Board"), { ssr: false });

const Game = () => {

  const router = useRouter();

  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  useEffect(() => {
    const baseUrl = "http://localhost:8000"
    let body = null
    if (router.query.gameId) {
      const idOnlyBody = {
        roomId: router.query.gameId,
        boardType: null,
        length: null,
        width: null,
        rowsToPopulate: null,
        pawnRow: null,
      }
      body = JSON.stringify(idOnlyBody)
    }
    
    if (router.query.requestBody) {
      body = router.query.requestBody
    }

    setLoading(true)
    if (router.query.requestBody|| router.query.gameId) {
      console.log("Body: ", body)
      fetch(`${baseUrl}/board`, {
        method: "POST",
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      }).then((response) => {
        return response.json()
      })
      .then((data) => {
        setBoard(JSON.parse(data))
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(true)
      });
    }
    
  }, [router.query])
  
  if (!router.query.gameId || loading) {
    return <div>Loading...</div>;
  } 
  
  if (error) {
    return <div>Error...</div>;
  }
  
  return (
    <div className="">
      <TopNav />
        <Board
          variant={router.query.variant}
          numPlayers={router.query.numPlayers}
          gameId={router.query.gameId}
          initialBoard={board}
        />
    </div>
  );
};

export default Game;
