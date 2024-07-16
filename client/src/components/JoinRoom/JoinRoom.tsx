import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'; 

const JoinRoom = ({ socket }) => {
  const { user } = useUser(); 

  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleClick = () => {
    if (roomId.length === 0) {
      setError('Please enter room id');
      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }

    user? socket.emit('joinExistingRoom', { username: user.userName, userId: user.userId, roomId }) : console.log("cipa");
  
  };

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }

    socket.on('message', (payload:any) => {
      console.log(payload);
      if (payload.error) {
        setError(payload.error);
        setTimeout(() => {
          setError('');
        }, 4000);
        return;
      }
      setJoined(true);
      }
    );
  }, [socket, user]);

  return (
    <div className='flex flex-col pt-16 items-center text-center'>
      <h2>Join Game</h2>
        <div className=''>
          {error.length > 0 ? <p className='error'>{error}</p> : null}
          <input value={roomId} onChange={(e) => setRoomId(e.target.value)} className='w-40 h-4 bg-blue-100 bg-opacity-5 text-white border-none outline-none border-b-2 border-blue-400 py-2 my-2 mt-20 text-lg font-bold cursor-pointer transition-all duration-200 ease-in-out focus:border-blue-400' type='text' />
          <div className='rounded bg-blue-300 w-40 h-0.5'></div>
          <button disabled={joined} onClick={handleClick} className=' bg-black mt-4 rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black'>
            {joined ? 'Joined' : 'Join'}
          </button>
        </div>
        <div className='go-to-game'>
          {joined ? (
            <Link to={`/game/${roomId}`}>
              <button className='block bg-black my-1 rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black'>Play Game</button>
            </Link>
          ) : null}
        </div>
      </div>
  );
};

export default JoinRoom;
