import { useEffect, useState } from "react";
import Board from "../components/Board";
import io from "Socket.IO-client";
let socket;

const Home = () => {

  return (
    <>
      <Board variant="default" />
    </>
  );
};

export default Home;
