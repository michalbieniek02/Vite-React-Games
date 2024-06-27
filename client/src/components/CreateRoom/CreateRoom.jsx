import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import './CreateRoom.scss';
import { useUser } from '../../contexts/UserContext'; 
import { nanoid } from 'nanoid';

const CreateRoom = ({ socket }) => {
  const { user } = useUser(); 

  const roomId = nanoid(7);

  if (!user) {
    window.location.href = '/';
    return null; 
  }

  useEffect(() => {
    socket.emit('joinRoom', { username: user.userName, userId: user.userId, roomId });
  }, [socket, user]);

  socket.on('message', (payload) => {
    console.log(payload);
  });

  return (
    <div className='create-room'>
      <h2>Invite Friend</h2>
      <div className='create-room-container'>
        <div className='url-container'>
          <input value={roomId} className='name-input url-input' type='text' disabled={true} />
        </div>
        <div className='go-to-game'>
          <Link to={`/game/${roomId}`}>
            <button className='room-btn'>Play Game</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
