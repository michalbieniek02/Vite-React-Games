import React, { useState } from 'react'
import "./Navbar.scss"
import {Link} from "react-router-dom"

const NavBar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleMenu = () => {
    setIsNavOpen(!isNavOpen);
    console.log(isNavOpen);
  };

  return (
    <>
      <nav className='navbar'>
          <p className='nav-title'>React Games</p>
          <div className='nav-content' >
            <ul className={`navbar-links ${isNavOpen ? 'open' : ''}`}>
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
      {isNavOpen?
      <div className='mobile-nav-content' >
        <Link to="/" onClick={()=>setIsNavOpen(false)}>Home</Link>
        <Link to="/tic-tac-toe" onClick={()=>setIsNavOpen(false)}>Tic Tac Toe</Link>
        <Link to="/memory" onClick={()=>setIsNavOpen(false)}>Memory</Link>
      </div> : ''}
    </>
  )
}

export default NavBar