import dynamic from "next/dynamic";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../components/Auth/firebaseSetup";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav"

const Board = dynamic(() => import("../components/Board"), { ssr: false });

// Features to add:
// Authentication
// Player accounts
// More variants
// Mobile friendly
// Match up with specific players and select variants

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

  return (
    <>
      <TopNav user={user} />
      <Board variant="default" />
    </>
  );
};

export default Home;
