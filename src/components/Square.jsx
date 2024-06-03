 import React from 'react'
 
 const Square = ({value, onClick,turn}) => {
   return ( 
    <button className={`square ${turn}`} onClick={onClick}>
        {value}
    </button>
   )
 }
 
 export default Square

