import Router from "next/router";
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";
import { variantDescriptions } from "../components/variants";
import styles from "../styles/Home.module.css";
import VariantCard from "../components/VariantCard";

// TODO: improve UI by adding lichess-style colored outline for valid move squares
// TODO: make endpoint for board generation and call it from front end = None
// TODO: implement drag and drop 
// TODO: add play clocks
// TODO: display red when king in check
// TODO: add "secret king" mode

export const gameId = uuidv4();

const baseUrl = "http://localhost:8000"
const data = {
  roomId: gameId,
  boardType: "random_same",
  length: 8,
  width: 8,
  boardParams: {
    rowsToPopulate: 2,
    pawnRow: true,
  }
};

async function getBoard(data) {
  await fetch(`${baseUrl}/board`, {
    method: "POST", // or 'PUT'
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("Success:", response);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}



const Home = () => {
  const [numPlayers, setNumPlayers] = useState(1);
  getBoard(data)

  const handleClick = (numPlayers, variant) => {
    // 1. Post request. Send gameId and params needed to build board
    // 2. That request will check the gameId to see if there is already a board.
    // 3. If there is a board, ignore the other params and use that
    // 4. Otherwise, create board with params, attach to room via id
    // 5. Connect to room (which has board either way)
    Router.push({
      pathname: "/game",
      query: { numPlayers: numPlayers, variant: variant, gameId: gameId },
    });
  };

  const variantArray = Object.keys(variantDescriptions);
  const variantButtonConfig = variantArray.map((variant, key) => (
    <VariantCard key={key} variantTitle={variant} variantDescription={variantDescriptions[variant]} className={styles.card} onClick={() => handleClick(numPlayers, variant)} />
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
