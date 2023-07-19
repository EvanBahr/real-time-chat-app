// import React from 'react'
import { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [Credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { user, handleUserLogin } = useAuth();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });
  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setCredentials({ ...Credentials, [name]: value });
    // console.log(Credentials);
  };
  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => handleUserLogin(e, Credentials)}>
          <div className="field--wrapper">
            <label>Email:</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Enter Your Email..."
              value={Credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <label>Password:</label>
            <input
              type="password"
              required
              name="password"
              placeholder="Enter Your Password..."
              value={Credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <input
              className="btn btn--lg btn--main"
              type="submit"
              value="Login"
            />
          </div>
        </form>
        <p>
          dont have an account register <Link to={"/register"}>here</Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
