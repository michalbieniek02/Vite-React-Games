import React from 'react'
import "./Footer.scss"
import ig from "../../assets/ig.png"
import x from "../../assets/x.png"
import linked from "../../assets/linked.png"

const Footer = () => {
  return (
    <div className='footer'>
        <div className='left-section'>
            <h1>If u want to put your game on our site contact us </h1>
            <p>+48 789 113 371</p>
            <p>essa@email.com</p>
        </div>
        <div className="right-section">
            <h1>We appreciate all users of our page</h1>
            <span>Have fun playing and visit our socials</span>
            <div className="socials">
              <img src={ig} alt="ig logo" />
              <img src={x} alt="x logo" />
              <img src={linked} alt="lnkdin logo" />
            </div>
        </div>
    </div>
  )
}

export default Footer