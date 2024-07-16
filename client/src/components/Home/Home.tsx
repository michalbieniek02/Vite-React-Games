import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { useUser } from '../../contexts/UserContext';

const Home = () => {
  const { login } = useUser();

  const userId = nanoid(5);

  const [userName, setUserName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    if (userName === '') {
      setError('Please enter your name');
      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }
    login(userName, userId);
    setShowInput(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div className='flex flex-col items-center h-[740px] pt-16'>
      <h2>Welcome to tic tac toe</h2>

      {error.length > 0 ? <p className='absolute top-[295px] text-red-500 text-sm'>{error}</p> : null}

      {!showInput ? (
        <>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleKeyPress}
            className='w-40 h-4 bg-blue-100 bg-opacity-5 text-white border-none outline-none border-b-2 border-blue-400 py-2 my-2 mt-20 text-lg font-bold cursor-pointer transition-all duration-200 ease-in-out focus:border-blue-400'
            type='text'
            placeholder='Name'
          />
          <div className='rounded bg-blue-300 w-40 h-0.5'></div>
          <button className='bg-black rounded-lg text-white py-2 px-4 mt-5 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black' type='button' onClick={handleClick}>
            Let's Go
          </button>
        </>
      ) : null}

      {showInput && (
        <div className='mt-20'>
          <div className='flex space-x-5'>
            <Link to='/createRoom'>
              <button className='bg-black rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black'>Invite Friend</button>
            </Link>
            <Link to='/joinRoom'>
              <button className='bg-black rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black'>Join Room</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;