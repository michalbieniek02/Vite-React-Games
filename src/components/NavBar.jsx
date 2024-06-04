import React, { useState } from 'react'
import "../styles/Navbar.scss"
import {Link} from "react-router-dom"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  return (
    <nav className='navbar'>
        React Games 
        <div className='nav-content' >
          <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
            <li className='nav-link'>
              <Link to="/">Home</Link>
            </li>
            <li className='nav-link'>
              <Link to="/tic-tac-toe">Tic Tac Toe</Link>
            </li>
            <li className='nav-link'>
              <Link to="/memory">Memory</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>☰</div>
    </nav>
  )
}

export default NavBar