import React from "react";
import { auth } from "../firebase/firebase";
import styles from "../styles/signInPage.module.css";
import Button from "../components/Button";
import Input from "../components/Input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully");
      setEmail("");
      setPassword("");
      navigate("/Tutorial");
    } catch (error) {
      console.log(error);
      toast.error("Failed to sign in try again");
    }
  };

  const signUp = () => {
    navigate("/SignUp");
  };

  return (
    <div className={styles.signInWrapper}>
      <Toaster position="bottom-left" reverseOrder={false}></Toaster>
      <div className={styles.signInCard}>
        <div className={styles.signInHeader}>
          <h2>Sign In</h2>
        </div>
        <div className={styles.signInForm}>
          <form onSubmit={signIn}>
            <div className={styles.signInFormGroup}>
              <label>Email</label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.signInFormGroup}>
              <label>Password</label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.signInButton}>
              <Button text="Sign In" onClick={signIn}></Button>
              <Button text="Sign Up" type="button" onClick={signUp}></Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
