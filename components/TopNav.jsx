import Link from "next/link";

const TopNav = ({ user }) => {
  return (
    <nav>
      <p>
        <Link href="/">Home</Link>
      </p>
    </nav>
  );
};

export default TopNav;
