import React, { useState } from "react";
import "../style/form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(username, email, password);
      console.log("user registered");
      navigate("/");
    } catch (err) {
      console.log(err);
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            id="username"
            placeholder="Enter Username"
          />
          <input
            value={email}
            onInput={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email Address"
          />
          <input
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
          />
          <button className="button primary-button">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
