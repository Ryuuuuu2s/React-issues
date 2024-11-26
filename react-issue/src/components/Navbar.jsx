import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightToBracket, faFilePen, faHouse,faGear,faSquarePollVertical } from '@fortawesome/free-solid-svg-icons'

const Navbar = ({ isAuth }) => {
  return (
    <nav>
      {!isAuth ? (
        <>
          <Link to="/login">
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            Login
          </Link>
        </>
      ) : (
        <>
          <Link to="/">
            <FontAwesomeIcon icon={faHouse} />
            Home
          </Link>
          <Link to="/report">
            <FontAwesomeIcon icon={faSquarePollVertical} />
            Report
          </Link>
          <Link to="/createpost">
            <FontAwesomeIcon icon={faFilePen} />
            Chat
          </Link>
          <Link to="/setting">
            <FontAwesomeIcon icon={faGear} />
            Setting
          </Link>
          <Link to="/logout">
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            Logout
          </Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
