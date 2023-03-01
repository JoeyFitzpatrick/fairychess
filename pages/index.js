import Router from "next/router";
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";
import { variants } from "../components/variants";
import styles from "../styles/Home.module.css";
import VariantCard from "../components/VariantCard";

// TODO: make it so that making board, going back, and making another board fetches the new board, not the old one
// TODO: add play clocks
// TODO: display red when king in check
// TODO: add "secret king" mode

export const gameId = uuidv4();

const baseUrl = "http://localhost:8000"
const requestBody = {
  roomId: gameId,
  boardType: "",
  length: 8,
  width: 8,
  rowsToPopulate: 2,
  pawnRow: true,
};


const Home = () => {

async function getBoard(body) {
  let response = await fetch(`${baseUrl}/board`, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).catch((error) => {
    console.error("Error:", error);
  });

  return await response.json();
}

  const [numPlayers, setNumPlayers] = useState(1);

  const handleClick = async (numPlayers, requestType) => {
    requestBody.boardType = requestType;
    console.log(requestBody);
    const board = await getBoard(requestBody)
    
    Router.push({
      pathname: "/game",
      query: { numPlayers: numPlayers, gameId: gameId, board: board },
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
