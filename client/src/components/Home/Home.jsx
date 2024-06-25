import React,{useRef, useState} from 'react'
import { Link } from 'react-router-dom';
import './Home.scss'
import {useDispatch} from 'react-redux'
import {addUser} from '../../Actions'
import {nanoid} from 'nanoid';


const Home = () => {
  
  const userId = nanoid(5);

  const [userName, setUserName] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [error, setError]  = useState('');

  const dispatch = useDispatch();

  const handleClick = () => {
    if(userName===''){
      setError('Please enter your name')
      setTimeout(() => {
        setError('');
      },4000)
      return;
    }

    dispatch(addUser(userName, userId));

    setShowInput(true);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleClick()
    }
}

  return (
    <div className='home'>
      <h2>Welcome to tic tac toe</h2>

      {error.length>0 ? <p className='error'>{error}</p>:null}

      {
        !showInput ? <>
        <input 
            value={userName} 
            onChange={(e)=>setUserName(e.target.value)} 
            onKeyDown={handleKeyPress}
            className='name-input' 
            type="text" 
            placeholder='Enter your name'
            />
        <button className='room-btn' type='submit' onClick={handleClick}>Let's Go</button>
        </>:null
      }

      {
        showInput &&
        <div className="showInput">

        <div className="room-btns">
          <Link  to="/createRoom">
            <button className='room-btn'>Invite Friend</button>
          </Link>
          <Link  to="/joinRoom">
            <button className='room-btn'>Join Room</button>
          </Link>
        </div>
        </div>
      }


    </div>
  )
}

export default Home