import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const moves = [
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
  { move: -1, myMove: false },
];

const Game = ({ socket }) => {
  const params = useParams();
  const roomId = params.roomId;
  const { user } = useUser();
  const [moveCounter,setMoveCounter] = useState(0)
  const [gameState, setGameState] = useState({
    isLoading: true,
    loadingValue: 'waiting for another player...',
    userJoined: false,
    userTurn: false,
    oponentName: '',
    yourName:'',
    move: null,
    allMoves: [],
    winner: '',
    winnerId: '',
    winPattern: [],
    gameEnd: false,
    leaveRoom: false,
    myScore: 0,
    oponentScore: 0,
    symbol: '',
    enemySymbol:'',
  });

  useEffect(() => {
    if (!user) {
      window.location = '/';
    }
    socket.emit('usersEntered', { roomId: params.roomId, userId: user.userId });
    socket.off('usersEntered').on('usersEntered', (data) => {
       setGameState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
      
      if (data.user1.userId !== user.userId) {
        setGameState((prevState) => ({
          ...prevState,
          oponentName: data.user1.username,
          yourName: data.user2.username,
          symbol: 'X',
          enemySymbol:'O',
        }));
        return
      } 
        setGameState((prevState) => ({
          ...prevState,
          oponentName: data.user2.username,
          yourName: data.user1.username,
          symbol: 'O',
          enemySymbol: 'X',
        }));
    });
  }, [socket, user, params.roomId]);

  const handleMoveClick = (m) => {
    if (gameState.isLoading && !gameState.userJoined) return;

    socket.emit('move', { move: m, roomId, userId: user.userId });
    setMoveCounter(moveCounter+1)
    moves[m].move = 1;
    moves[m].myMove = true;
    setGameState((prevState) => ({
      ...prevState,
      userTurn: true,
    }));
    
  };

  const handlePlayAgain = () => {
    socket.emit('reMatch', { roomId });
  };

  useEffect(()=>{
    socket.on('move', (payload) => {
      setGameState((prevState) => ({
        ...prevState,
        move: { move: payload.move, myMove: payload.userId === user.userId },
        allMoves: [...gameState.allMoves, gameState.move],
      }));
      
      moves[payload.move].move = 1;
      moves[payload.move].myMove = payload.userId === user.userId;
  
      if (payload.userId !== user.userId) {
        setGameState((prevState) => ({
          ...prevState,
          userTurn: false,
        }));
      }
    });
  
    socket.on('win', (payload) => {
      setGameState((prevState) => ({
        ...prevState,
        winPattern: payload.pattern,
        gameEnd: true,
      }));

      setGameState((prevState) => ({
        ...prevState,
        winnerId: payload.userId,
        userTurn: false,
      }));
      if (payload.userId === user.userId) {
        setGameState((prevState) => ({
          ...prevState,
          winner: 'You won!',
          myScore: prevState.myScore + 0.5 ,
        }));
        return
      }
      setGameState((prevState) => ({
        ...prevState,
        winner: `You lost!, ${payload.username} won!`,
        oponentScore: prevState.oponentScore + 0.5 ,
      }));
    });
  
    socket.on('draw', () => {
      setGameState((prevState) => ({
        ...prevState,
        winner: 'Draw !',
        gameEnd: true,
        userTurn: false,
        loadingValue: '',
      }));
    });
  
    socket.on('reMatch', () => {
      moves.forEach((m) => {
        m.move = -1;
        m.myMove = false;
      });
      setGameState((prevState) => ({
        ...prevState,
        winner: '', 
        userTurn: false,
        gameEnd: false,
      }));
    });
  
    socket.on('removeRoom', () => {
      setGameState((prevState) => ({
        ...prevState,
        userJoined: false,
        leaveRoom: true,
      }));
    });
  
    socket.on('userLeave', () => {
      setGameState((prevState) => ({
        ...prevState,
        loadingValue: `${gameState.oponentName} left the game. Go back to Home Page`,
        isLoading: true,
        userJoined: false,
      }));
      window.location.reload()
    });
  },[])

  

  const handleClose = () => {
    socket.emit('removeRoom', { roomId });
    return true;
  };

  return (
    <div className="relative mb-[10px] max-w-[300px] h-[788px] mx-auto mt-16 text-center">
      <p className='text-[1rem]'>{moveCounter > 0 ? "Good luck" : "Whoever moves first is starting"}</p>
      <div className="text-[1rem]">
        <p>{gameState.yourName}: {gameState.myScore} | {gameState.oponentName}: {gameState.oponentScore}</p>
      </div>
      {gameState.winner && gameState.winner !== 'Draw !' && gameState.winner.length > 0 ? (
        <div className="winner">
          <h3>{gameState.winner}</h3>
          <div className={` line p${gameState.winPattern} `}></div>
        </div>
      ) : null}
      <div className="grid max-w-[280px] grid-cols-[auto_auto_auto] p-[10px] justify-center ">
        {Array.from({ length: 9 }, (_, i) => {
          const index = i + 1;
          const move = moves[index];
          const className = ` relative p-[30px] text-[24px] w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] text-center text-black border-2 border-black`;

          return (
            <div
              key={index}
              onClick={move.move === -1 && !gameState.winner && !gameState.userTurn ? () => handleMoveClick(index) : null}
              className={move.move === -1 ? `hover:bg-[#00000007] ${className}` : className}
            >
              {move.move !== -1 ? (move.myMove ? gameState.symbol : gameState.enemySymbol) : null}
            </div>
          );
        })}
      </div>
      {gameState.isLoading ? <div className="isLoading">{gameState.loadingValue}</div> : null}
      {gameState.userTurn ? <div className="isLoading">{`Waiting for oponent's response`}</div> : null}
      {gameState.gameEnd ? (
        <div className="game-end">
          {!gameState.leaveRoom ? <button onClick={handlePlayAgain} className="bg-black my-2 rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black">Play Again</button> : null}
          <form onSubmit={handleClose} action="/">
            <button className="bg-black rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black">Close</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Game;
