import Router from "next/router";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";
import { variants } from "../components/variants";

// TODO: implement classes to make piece creation more extensible

const Home = () => {
  const [numPlayers, setNumPlayers] = useState(1);

  useEffect(() => {
    window.sessionStorage.removeItem("board");
    window.sessionStorage.removeItem("turnColor");
    window.sessionStorage.removeItem("isMyTurn");
    window.sessionStorage.removeItem("whiteWins");
    window.sessionStorage.removeItem("blackWins");
    window.sessionStorage.removeItem("gameOver");
    window.sessionStorage.removeItem("playerColor");
    window.sessionStorage.removeItem("playerQuantity");
  }, []);

  const handleClick = (numPlayers, variant) => {
    Router.push({
      pathname: "/game",
      query: { numPlayers: numPlayers, variant: variant, gameId: uuidv4() },
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

  return (
    <div>
      <TopNav />
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
