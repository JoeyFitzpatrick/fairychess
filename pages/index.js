import Router from "next/router";
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";
import { variantDescriptions } from "../components/variants";
import styles from "../styles/Home.module.css";
import VariantCard from "../components/VariantCard";

// TODO: improve UI by adding lichess-style colored outline for valid move squares
// TODO: implement drag and drop 
// TODO: add play clocks
// TODO: display red when king in check
// TODO: add "secret king" mode

export const gameId = uuidv4();

const Home = () => {
  const [numPlayers, setNumPlayers] = useState(1);

  const handleClick = (numPlayers, variant) => {
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
          active
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
