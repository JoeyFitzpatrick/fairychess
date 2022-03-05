import dynamic from "next/dynamic";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../components/Auth/firebaseSetup";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav"
import UserDisplay from "../components/UserDisplay";

const Board = dynamic(() => import("../components/Board"), { ssr: false });

// Features to add:
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
      <UserDisplay user={user} data={data} />
    </>
  );
};

export default Home;
