import Router from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../components/Auth/firebaseSetup";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import TopNav from "../components/TopNav";
import { v4 as uuidv4 } from "uuid";

// Features to add:
// More variants
// Mobile friendly

const Home = () => {
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

  const handleClick = (numPlayers, variant) => {
    Router.push({
      pathname: "/game",
      query: { numPlayers: numPlayers, variant: variant, gameId: uuidv4() },
    });
  };

  return (
    <div>
      <TopNav user={user} />
      Welcome to Fairy Chess!
      <Button onClick={() => handleClick(2, "default")}>Default</Button>
      <Button onClick={() => handleClick(2, "defaultLarger")}>
        Bigger Board
      </Button>
      <Button onClick={() => handleClick(2, "defaultSmaller")}>
        Smaller Board
      </Button>
    </div>
  );
};

export default Home;
