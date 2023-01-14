import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import TopNav from "../components/TopNav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
      <Container fluid>
        <Row>
          <Col></Col>
          <Col md={8}>
            <Board
              variant={router.query.variant}
              numPlayers={router.query.numPlayers}
            />
          </Col>
          <Col>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Game;
