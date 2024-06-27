import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import './Game.scss';

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
  const { user } = useUser();
  const navigate = useNavigate();

const [moveCounter,setMoveCounter] = useState(0)
  const [hint, setHint] = useState('Whoever moves first is starting');
  const [roomId, setRoomId] = useState('');
  const [gameState, setGameState] = useState({
    isLoading: true,
    loadingValue: 'waiting for another player...',
    userJoined: false,
    userTurn: false,
    oponentName: '',
    move: null,
    allMoves: [],
    winner: '',
    winnerId: '',
    winPattern: [],
    gameEnd: false,
    leaveRoom: false,
    myScore: 0,
    oponentScore: 0,
  });
useEffect(()=>{
  if(moveCounter>0) setHint("Good luck")
    else setHint('Whoever moves first is starting')
},[moveCounter])

  useEffect(() => {
    if (!user) {
      window.location = '/';
    }
    socket.emit('usersEntered', { roomId: params.roomId, userId: user.userId });
    socket.off('usersEntered').on('usersEntered', (data) => {
      if (data.user1.userId !== user.userId) {
        setGameState((prevState) => ({
          ...prevState,
          oponentName: data.user1.username,
        }));
      } else {
        setGameState((prevState) => ({
          ...prevState,
          oponentName: data.user2.username,
        }));
      }
      setGameState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    });
  }, [socket, user, params.roomId]);

  useEffect(() => {
    setRoomId(params.roomId);
  }, [params.roomId]);

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

  socket.on('move', (payload) => {
    setGameState((prevState) => ({
      ...prevState,
      move: { move: payload.move, myMove: payload.userId === user.userId },
    }));
    setGameState((prevState) => ({
      ...prevState,
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
    }));
    setGameState((prevState) => ({
      ...prevState,
      gameEnd: true,
    }));
    if (payload.userId === user.userId) {
      setGameState((prevState) => ({
        ...prevState,
        winner: 'You won!',
      }));
      setGameState((prevState) => ({
        ...prevState,
        myScore: gameState.myScore + 1,
      }));
    } else {
      setGameState((prevState) => ({
        ...prevState,
        winner: `You lost!, ${payload.username} won!`,
      }));
      setGameState((prevState) => ({
        ...prevState,
        oponentScore: gameState.oponentScore + 1,
      }));
    }
    setGameState((prevState) => ({
      ...prevState,
      winnerId: payload.userId,
    }));
    setGameState((prevState) => ({
      ...prevState,
      userTurn: false,
    }));
  });

  socket.on('draw', () => {
    setGameState((prevState) => ({
      ...prevState,
      winner: 'Draw !',
    }));
    setGameState((prevState) => ({
      ...prevState,
      gameEnd: true,
    }));
    setGameState((prevState) => ({
      ...prevState,
      userTurn: false,
    }));
    setGameState((prevState) => ({
      ...prevState,
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
    }));
    setGameState((prevState) => ({
      ...prevState,
      userTurn: user.userId !== gameState.winnerId,
    }));
    setGameState((prevState) => ({
      ...prevState,
      gameEnd: false,
    }));
  });

  socket.on('removeRoom', () => {
    setGameState((prevState) => ({
      ...prevState,
      userJoined: false,
    }));
    setGameState((prevState) => ({
      ...prevState,
      leaveRoom: true,
    }));
  });

  socket.on('userLeave', () => {
    setGameState((prevState) => ({
      ...prevState,
      loadingValue: '',
    }));
    setGameState((prevState) => ({
      ...prevState,
      loadingValue: `${gameState.oponentName} left the game. Go back to Home Page`,
    }));
    setGameState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    setGameState((prevState) => ({
      ...prevState,
      userJoined: false,
    }));
    navigate('/');
  });

  const handleClose = () => {
    socket.emit('removeRoom', { roomId });
    return true;
  };

  return (
    <div className="game">
      <h2>Tic Tac Toe</h2>
      <p>{hint}</p>
      <div className="score">
        <p>You: {gameState.myScore}</p>
        <p>{gameState.oponentName}: {gameState.oponentScore}</p>
      </div>
      {gameState.winner && gameState.winner !== 'Draw !' && gameState.winner.length > 0 ? (
        <div className="winner">
          <h3>{gameState.winner}</h3>
          <div className={` line p${gameState.winPattern} `}></div>
        </div>
      ) : null}
      <div className="grid-container">
        {Array.from({ length: 9 }, (_, i) => {
          const index = i + 1;
          const move = moves[index];
          const className = `grid-item ${index <= 6 ? 'bottom' : ''} ${index % 3 !== 0 ? 'right' : ''}`;

          return (
            <div
              key={index}
              onClick={move.move === -1 && !gameState.winner && !gameState.userTurn ? () => handleMoveClick(index) : null}
              className={move.move === -1 ? `grid-item-hover ${className}` : className}
            >
              {move.move !== -1 ? (move.myMove ? '0' : 'X') : null}
            </div>
          );
        })}
      </div>
      {gameState.isLoading ? <div className="isLoading">{gameState.loadingValue}</div> : null}
      {gameState.userTurn ? <div className="isLoading">{`Waiting for oponent's response`}</div> : null}
      {gameState.gameEnd ? (
        <div className="game-end">
          {!gameState.leaveRoom ? <button onClick={handlePlayAgain} className="room-btn">Play Again</button> : null}
          <form onSubmit={handleClose} action="/">
            <button className="room-btn">Close</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Game;
