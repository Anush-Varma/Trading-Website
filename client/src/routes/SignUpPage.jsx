import React from "react";
import { auth } from "../firebase/firebase";
import "../styles/signUpPage.css";
import Button from "../components/Button";
import Input from "../components/Input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    } else if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      alert("Failed to create account try again");
    }
  };

  return (
    <div className="signUpWrapper">
      <div className="signUpCard">
        <div className="signUpHeader">
          <h2>Sign Up</h2>
        </div>
        <div className="signUpForm">
          <form onSubmit={signUp}>
            <div className="signUp-form-group">
              <label>Email</label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="signUp-form-group">
              <label>Password</label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="signUp-form-group">
              <label>Confirm Password</label>
              <Input
                type="password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="signUpButton">
              <Button text="Sign Up" onClick={signUp}></Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
