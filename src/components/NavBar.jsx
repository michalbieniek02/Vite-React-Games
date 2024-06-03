import React from 'react'
import "../styles/Navbar.scss"
const NavBar = () => {
  return (
    <nav className='navbar'>
        React Games 
        <div className='nav-content' >
        <ul>
            <li>Gam<a href='/chuj'></a></li>
            <li>Chuj</li>
            <li>cipa</li>
        </ul>
        </div>
    </nav>
  )
}

export default NavBar