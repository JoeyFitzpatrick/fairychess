import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  auth,
  logInWithEmailAndPassword,
} from "../components/Auth/firebaseSetup";
import { useAuthState } from "react-firebase-hooks/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) router.push("/dashboard");
  }, [user, loading]);
  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          <Link href="/">Login</Link>
        </button>
        <div>
          <Link href="/reset">Forgot Password</Link>
        </div>
        <div>
          Do not have an account? <Link href="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Auth;
