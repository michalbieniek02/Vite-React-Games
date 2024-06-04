import React from 'react'
import "../styles/Navbar.scss"
import {Link} from "react-router-dom"

const NavBar = () => {
  return (
    <nav className='navbar'>
        React Games 
        <div className='nav-content' >
        <ul>
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
    </nav>
  )
}

export default NavBar