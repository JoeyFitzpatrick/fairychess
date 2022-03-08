import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../components/Auth/firebaseSetup";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import ControlBoard from "../components/ControlBoard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Board = dynamic(() => import("../components/Board"), { ssr: false });

const Game = () => {
  const [user] = useAuthState(auth);
  const [data, setData] = useState();
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

  const router = useRouter();
  console.log(router.query);
  if (!router.query.gameId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <TopNav user={user} />
      <Container fluid>
        <Row>
          <Col></Col>
          <Col lg={8}>
            <Board
              variant={router.query.variant}
              gameId={router.query.gameId}
            />
          </Col>
          <Col style={{backgroundColor: "red"}}>
            <ControlBoard user={user} data={data} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Game;
