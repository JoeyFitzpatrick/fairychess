// import Board from "../components/Board";
import dynamic from 'next/dynamic'

const Board = dynamic(() => import('../components/Board'), { ssr: false });

const Home = () => {

  return (
    <>
      <Board variant="default" />
    </>
  );
};

export default Home;
