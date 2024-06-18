import React, { useState } from 'react'
import "../styles/Navbar.scss"
import {Link} from "react-router-dom"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  return (
    <>
      <nav className='navbar'>
          <p className='nav-title'>React Games</p>
          <div className='nav-content' >
            <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
              <li className='nav-link'>
                <Link to="/">Home</Link>
              </li>
              <li className='nav-link'>
                <Link to="/memory">Memory</Link>
              </li>
            </ul>
          </div>
          <div className="nav-toggle" onClick={toggleMenu}>☰</div>
      </nav>
      {isOpen?
      <div className='mobile-nav-content' >
        <Link to="/" onClick={()=>setIsOpen(false)}>Home</Link>
        <Link to="/tic-tac-toe" onClick={()=>setIsOpen(false)}>Tic Tac Toe</Link>
        <Link to="/memory" onClick={()=>setIsOpen(false)}>Memory</Link>
      </div> : ''}
    </>
  )
}

export default NavBar