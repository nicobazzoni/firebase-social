import React from "react";
import { Link } from "react-router-dom";
import transitions from "bootstrap";
import Avatar from 'react-avatar';

const Header = ({ active, setActive, user, name, handleLogout }) => {
  const userId = user?.uid;
 


  return (
    <nav className="navbar navbar-expand-lg navbar-light ">
      <div className="container-fluid bgBlue padding-media">
        <div className="container padding-media">
          <nav className="navbar navbar-toggleable-md navbar-light">
            <button
              className="navbar-toggler mt-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              data-bs-parent="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="true"
              aria-label="Toggle Navigation"
            >
              <span className="fa fa-bars"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "home" ? "active" : ""
                    }`}
                    onClick={() => setActive("home")}
                  >
                    Home
                  </li>
                </Link>
                <Link to="/blogs" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "blogs" ? "active" : ""
                    }`}
                    onClick={() => setActive("blogs")}
                  >
                    Items
                  </li>
                </Link>

                <Link to="/create" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "create" ? "active" : ""
                    }`}
                    onClick={() => setActive("create")}
                  >
                    Create
                  </li>
                </Link>

               
              
               
              
               
              </ul>
              <div className="row g-3">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  {userId ? (
                    <>
                      <div className="pt-2 p-2 mb-1 ">
                      <Avatar name={user?.displayName} round="20px" size="25" />
                      </div>
                      <p style={{ marginTop: "12px", marginLeft: "5px", fontSize: '12px'}}>
                        {user?.displayName}
                      </p>
                      <li className="nav-item nav-link" onClick={handleLogout}>
                        Logout
                      </li>
                    </>
                  ) : (
                    <Link to="/auth" style={{ textDecoration: "none" }}>
                      <li
                        className={`nav-item nav-link ${
                          active === "login" ? "active" : ""
                        }`}
                        onClick={() => setActive("login")}
                      >
                        Login
                      </li>
                    </Link>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Header;