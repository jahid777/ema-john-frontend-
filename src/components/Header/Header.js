import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import logo from "../../images/logo.png";
import "../Header/Header.css";
const Header = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  return (
    <div className="header">
      <img src={logo} alt="" />
      <nav>
        <Link to="/shop">Shop</Link>
        <Link to="/review">Order Review</Link>
        <Link to="/manage">Manage Inventory</Link>
        {/* <Link to = "/">{loggedInUser.email} </Link> */}
        <button onClick={() => setLoggedInUser({})} style={{ height: "45px" }}>
          Sign out
        </button>
      </nav>
    </div>
  );
};

export default Header;
