import Router from "next/router";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";
import { variants } from "../components/variants";
import CountdownTimer from '../components/timer/CountdownTimer';

// TODO: add play clocks
// TODO: display red when king in check
// TODO: add "secret king" mode

export const gameId = uuidv4();

const Home = () => {
  const [numPlayers, setNumPlayers] = useState(1);

  useEffect(() => {
    const storageItemsToDelete = [
      "board",
      "turnColor",
      "isMyTurn",
      "whiteWins",
      "blackWins",
      "gameOver",
      "playerColor",
      "playerQuantity",
    ];
    storageItemsToDelete.forEach((item) =>
      window.sessionStorage.removeItem(item)
    );
  }, []);

  const handleClick = (numPlayers, variant) => {
    Router.push({
      pathname: "/game",
      query: { numPlayers: numPlayers, variant: variant, gameId: gameId },
    });
  };

  const variantArray = Object.keys(variants);
  const variantButtonConfig = variantArray.map((variant, key) => (
    <Button
      key={key}
      className="game-select-button"
      variant="outline-primary"
      onClick={() => handleClick(numPlayers, variant)}
    >{`${variant}`}</Button>
  ));

  const now = new Date().getTime();
  const later = 60 * 1000;
  const time = now + later;

  return (
    <div>
      <TopNav />
      <h1>Countdown Timer</h1>
      <CountdownTimer targetDate={time} />
      <Container>
        <Row>
          <Col>
            <h2>Welcome to Fairy Chess!</h2>
            <p>
              Fairy chess is a term for any variant of regular chess, such as
              rule changes, new pieces, different board size, etc.
            </p>
            <h2>How to play:</h2>
            <p>
              To play with someone using a different device, make sure &quot;2
              Devices&quot; is selected, select the game mode, then follow the
              instructions on screen.{" "}
            </p>
            <p>
              To play with someone on the same device, or play by yourself, make
              sure &quot;1 Device&quot; is selected, then select the game mode.
            </p>
          </Col>
          <Col md={8} className="game-select-container">
            <div className="numPlayers-selectors">
              <Button
                variant="secondary"
                size="sm"
                className="numPlayers-select"
                active
                onClick={() => setNumPlayers(2)}
              >
                2 Devices
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="numPlayers-select"
                onClick={() => setNumPlayers(1)}
              >
                1 Device
              </Button>
            </div>

            <>{variantButtonConfig}</>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
