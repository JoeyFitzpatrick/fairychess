import Router from "next/router";
import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";
import { variants } from "../components/variants";
import styles from "../styles/Home.module.css";
import VariantCard from "../components/VariantCard";

// TODO: make it so that making board, going back, and making another board fetches the new board, not the old one
// TODO: add play clocks
// TODO: display red when king in check
// TODO: add "secret king" mode

const Home = () => {

  const [numPlayers, setNumPlayers] = useState(1);
  const [gameId, setGameId] = useState(uuidv4());
  
  useEffect(() => {
    setGameId(uuidv4());
  }, [])

  const requestBody = {
    roomId: gameId,
    boardType: "",
    length: 8,
    width: 8,
    rowsToPopulate: 2,
    pawnRow: true,
  };

  const handleClick = (numPlayers, requestType) => {
    requestBody.boardType = requestType;
    
    Router.push({
      pathname: "/game",
      query: { numPlayers: numPlayers, gameId: gameId, requestBody: JSON.stringify(requestBody) }
    },
      `/game`
    );
  };

  const variantButtonConfig = variants.map((variant, key) => (
    <VariantCard key={key} variantTitle={variant.title} variantDescription={variant.description} className={styles.card} onClick={() => handleClick(numPlayers, variant.requestType)} />
  ));

  const Variants = () => {
    return <div className={styles.cardContainer}>{variantButtonConfig}</div>;
  };

  return (
    <div className={styles.home}>
      <TopNav />
      <div className={styles.header}>
        <p>Fairy Chess</p>
      </div>
      <div className={styles.subheader}>
        <p>This is basically Chess 2.0</p>
        <button
          variant="secondary"
          size="sm"
          className="numPlayers-select"
          active="true"
          onClick={() => setNumPlayers(2)}
        >
          2 Devices
        </button>
        <button
          variant="secondary"
          size="sm"
          className="numPlayers-select"
          onClick={() => setNumPlayers(1)}
        >
          1 Device
        </button>
      </div>
      <Variants />
    </div>
  );
};

export default Home;
