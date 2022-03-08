import Router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../components/Auth/firebaseSetup";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";

// Features to add:
// More variants

const Home = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState();
  const [numPlayers, setNumPlayers] = useState(2);
  useEffect(() => {
    const getData = async () => {
      if (user) {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setData(data);
      }
    };
    getData();
  }, [user]);

  useEffect(() => {
    window.sessionStorage.removeItem('board');
    window.sessionStorage.removeItem('turnColor');
    window.sessionStorage.removeItem('isMyTurn');
    window.sessionStorage.removeItem('whiteWins');
    window.sessionStorage.removeItem('blackWins');
    window.sessionStorage.removeItem('gameOver');
    window.sessionStorage.removeItem('playerColor');
    window.sessionStorage.removeItem('playerQuantity');
    console.log(sessionStorage)
}, []);

  const handleClick = (numPlayers, variant) => {
    Router.push({
      pathname: "/game",
      query: { numPlayers: numPlayers, variant: variant, gameId: uuidv4() },
    });
  };

  return (
    <div>
      <TopNav user={user} />
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
            <Button
              className="game-select-button"
              variant="outline-primary"
              onClick={() => handleClick(numPlayers, "default")}
            >
              Default
            </Button>
            <Button
              className="game-select-button"
              variant="outline-primary"
              onClick={() => handleClick(numPlayers, "defaultLarger")}
            >
              Bigger Board
            </Button>
            <Button
              className="game-select-button"
              variant="outline-primary"
              onClick={() => handleClick(numPlayers, "defaultSmaller")}
            >
              Smaller Board
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
