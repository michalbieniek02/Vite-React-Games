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
  const roomId = params.roomId;
  const { user } = useUser();
  const navigate = useNavigate();
  const [moveCounter,setMoveCounter] = useState(0)
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
        }));
        return
      } 
        setGameState((prevState) => ({
          ...prevState,
          oponentName: data.user2.username,
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
          myScore: prevState.myScore + 0.5,
        }));
        return
      }
      setGameState((prevState) => ({
        ...prevState,
        winner: `You lost!, ${payload.username} won!`,
        oponentScore: prevState.oponentScore + 0.5,
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
      navigate('/');
    });
  },[])

  

  const handleClose = () => {
    socket.emit('removeRoom', { roomId });
    return true;
  };

  return (
    <div className="game">
      <h2>Tic Tac Toe</h2>
      <p>{moveCounter > 0 ? "Good luck" : "Whoever moves first is starting"}</p>
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
