import React, { useState } from 'react'
import {Link} from "react-router-dom"

const NavBar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleMenu = () => {
    setIsNavOpen(!isNavOpen);
    console.log(isNavOpen);
  };

  return (
    <>
      <nav className='flex  w-[100%] items-center content-center bg-black text-white font-normal p-5 text-2xl  '>
          <p className='ml-3 md:ml-5 flex-nowrap'>React Games</p>
          <div className='ml-[50%]' >
            <ul className={` hidden gap-7 list-none navbar-links ${isNavOpen ? 'open' : ''} md:flex`}>
              <li className='hover:text-gray-300'>
                <Link to="/">Home</Link>
              </li>
              <li className='hover:text-gray-300'>
                <Link to="/memory">Memory</Link>
              </li>
            </ul>
          </div>
          <div className="block absolute cursor-pointer ml-7 -translate-y-1 md:hidden text-5xl right-5" onClick={toggleMenu}>☰</div>
      </nav>
      {isNavOpen?
      <div className='grid bg-black pt-7 pb-14 text-3xl content-center text-center border-t border-solid border-white gap-5 text-white cursor-pointer' >
        <Link to="/" onClick={()=>setIsNavOpen(false)}>Home</Link>
        <Link to="/tic-tac-toe" onClick={()=>setIsNavOpen(false)}>Tic Tac Toe</Link>
        <Link to="/memory" onClick={()=>setIsNavOpen(false)}>Memory</Link>
      </div> : ''}
    </>
  )
}

export default NavBar
