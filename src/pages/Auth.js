import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

const initialState = {
  email: "",
  password: "",
};

const Auth = ({ setActive, setUser }) => {
  const [state, setState] = useState(initialState);
  const { email, password } = state;


  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (email && password) {
      // 🔒 Check if email is invited
      const docRef = doc(db, "invites", email.trim().toLowerCase());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return toast.error("Access Denied: This email is not authorized.");
      }

      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
        setActive("home");
        navigate("/");
      } catch (err) {
        toast.error("Invalid credentials or user does not exist.");
      }

    } else {
      return toast.error("Please enter both email and password.");
    }
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            Sign-In
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row" onSubmit={handleAuth}>
              <div className="col-12 py-3">
                <input
                  type="email"
                  className="form-control input-text-box"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <input
                  type="password"
                  className="form-control input-text-box"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3 text-center">
                <button className="btn btn-sign-in" type="submit">
                  Sign In
                </button>
              </div>
            </form>
            <div className="text-center mt-2 pt-2">
              <p className="small fw-bold mt-2 pt-1 mb-0">
                This site is private. Authorized users only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;