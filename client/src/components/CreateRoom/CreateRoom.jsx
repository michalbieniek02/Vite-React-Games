import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
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
    <div className=' mt-16 text-4xl items-center justify-center text-center'>
      <h2 className='my-6'>Invite Friend</h2>
      <div className='create-room-container'>
        <div className='w-max mx-auto'>
          <input value={roomId} className='rounded w-[250px] text-center p-6 bg-blue-200 text-2xl' type='text' disabled={true} />
        </div>
        <div className='go-to-game'>
          <Link to={`/game/${roomId}`}>
            <button className='bg-black my-6 rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black'>Play Game</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;