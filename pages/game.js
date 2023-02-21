import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import TopNav from "../components/TopNav";

const Board = dynamic(() => import("../components/Board"), { ssr: false });

const Game = () => {

  const router = useRouter();
  if (!router.query.gameId) {
    return <div>Loading...</div>;
  } else {
    
  }
 
  return (
    <div className="">
      <TopNav />
        <Board
          variant={router.query.variant}
          numPlayers={router.query.numPlayers}
          gameId={router.query.gameId}
        />
    </div>
  );
};

export default Game;
