import { useState } from "react";
import { useAuth } from "../utils/AuthContext";

function RegisterPage() {
  const { handleUserRegister } = useAuth();
  const [Credentials, setCredentials] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
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
        <form onSubmit={(e) => handleUserRegister(e, Credentials)}>
          <div className="field--wrapper">
            <label>Name</label>
            <input
              type="text"
              required
              name="name"
              placeholder="Enter Your Name..."
              value={Credentials.name}
              onChange={handleInputChange}
            />
          </div>
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
              name="password1"
              placeholder="Enter Your Password..."
              value={Credentials.password1}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <label>Confirm Password:</label>
            <input
              type="password"
              required
              name="password2"
              placeholder="Confirm Your Password..."
              value={Credentials.password2}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <input
              className="btn btn--lg btn--main"
              type="submit"
              value="Register"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
