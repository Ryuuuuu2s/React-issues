import "../../styles/Navbar.css";
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRectangleList,
  faBomb,
  faGlobe,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  isAuth: boolean;
  userEmail: string | null;
  managerAddress: string;

}

const Navbar = ({ isAuth, userEmail, managerAddress }: NavbarProps) => {


  return (
    <header>
      <nav className="navbar">
        <ul className="navbar-links">
          {!isAuth ? (
            <></>
          ) : userEmail === managerAddress ? (
            <>
              <li>
                <Link to="/managerlist">
                  <FontAwesomeIcon icon={faRectangleList} />
                  ManagerList
                </Link>
              </li>
              <li>
                <Link to="/alllist">
                  <FontAwesomeIcon icon={faGlobe} />
                  AllList
                </Link>
              </li>
              <li>
                <Link to="/badlist">
                  <FontAwesomeIcon icon={faBomb} />
                  BadList
                </Link>
              </li>
              <li>
                <Link to="/logout">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/">
                  <FontAwesomeIcon icon={faHouse} />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/customerlist">
                  <FontAwesomeIcon icon={faRectangleList} />
                  CustomerList
                </Link>
              </li>
              <li>
                <Link to="/logout">
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
