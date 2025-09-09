import React from "react";
import logo from "../../logo.svg";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar_section">
      <div className="logo_side">
        <img className="logo_style" src={logo} />
        <h2>Book Store</h2>
      </div>
      <div className="headings_side">
        <ul>
          <li>
            <Link to="#" className="headings_link">
              <h2>Home</h2>
            </Link>
          </li>
          <li>
            <Link to="/" className="headings_link">
              <h2>Books</h2>
            </Link>
          </li>
          <li>
            <Link to="#" className="headings_link hide">
              <h2>About Us</h2>
            </Link>
          </li>
          <li>
            <Link to="#" className="headings_link hide">
              <h2>Contact Us</h2>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
