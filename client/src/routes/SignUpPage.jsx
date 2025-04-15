import React from "react";
import { auth } from "../firebase/firebase";
import styles from "../styles/signUpPage.module.css";
import Button from "../components/Button";
import Input from "../components/Input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create account try again");
    }
  };

  return (
    <div className={styles.signUpWrapper}>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className={styles.signUpCard}>
        <div className={styles.signUpHeader}>
          <h2>Sign Up</h2>
        </div>
        <div className={styles.signUpForm}>
          <form onSubmit={signUp}>
            <div className={styles.signUpFormGroup}>
              <label>Email</label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.signUpFormGroup}>
              <label>Password</label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.signUpFormGroup}>
              <label>Confirm Password</label>
              <Input
                type="password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className={styles.signUpButton}>
              <Button text="Sign Up" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
