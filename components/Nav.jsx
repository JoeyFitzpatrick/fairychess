import Link from "next/link";

const Nav = ({ user }) => {
  return (
    <nav className="flex lg:justify-between w-full lg:text-4xl min-h-fit mb-1 pl-4 pr-4">
      <div>
        <h2 className="self-center lg:pr-40">Fairy Chess</h2>
      </div>
      <div className="justify-center">
        <Link
          className="lg:text-lg m-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-1 border border-blue-500 hover:border-transparent rounded"
          href="/auth"
        >
          {user ? "Logout" : "Login"}
        </Link>
        <Link
          className="lg:text-lg m-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-1 border border-blue-500 hover:border-transparent rounded"
          href="/register"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
