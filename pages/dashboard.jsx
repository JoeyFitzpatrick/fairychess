import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../components/Auth/firebaseSetup";
import { query, collection, getDocs, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const router = useRouter();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return router.push("/");
    fetchUserName();
  }, [user, loading]);
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <Link href="/">Home</Link>
        <button className="dashboard__btn" onClick={logout}>
        <Link href="/">Logout</Link>
        </button>
      </div>
    </div>
  );
}
export default Dashboard;
