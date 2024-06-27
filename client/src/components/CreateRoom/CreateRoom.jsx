import React, {useEffect,useState} from 'react'
import './CreateRoom.scss'
import {nanoid} from 'nanoid'
import {Link} from 'react-router-dom'
import {useSelector } from 'react-redux'

const roomId = nanoid(7)

const CreateRoom = ({socket}) => {

  const { user} = useSelector((state) => state.user);

  if(!user){
    window.location.href = '/';
  }

  useEffect(()=>{
    socket.emit('joinRoom', {username:user.userName, userId:user.userId, roomId});
  },[socket])

  
    socket.on('message', (payload)=>{
      console.log(payload)
    })

    socket.on('message', (message) => {
      console.log(message);
    });
  

  return (
    <div className='create-room'>
      <h2>Invite Friend</h2>


      <div className="create-room-container">
        <div className="url-container">
        <input value={roomId}  className='name-input url-input' type="text" disabled={true}/>
        </div>
        <div className="go-to-game">
        <Link  to={`/game/${roomId}`}> <button className='room-btn' >Play Game</button> </Link>
        </div>
      </div>
    </div>
  )
}

export default CreateRoom