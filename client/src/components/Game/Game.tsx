import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

type GameState = {
  isLoading: boolean;
  loadingValue: string;
  userJoined: boolean;
  userTurn: boolean;
  opponentName: string;
  yourName: string;
  move: { move: number; myMove: boolean } | null;
  allMoves: { move: number; myMove: boolean }[];
  winner: string;
  winnerId: string;
  winPattern: number[];
  gameEnd: boolean;
  leaveRoom: boolean;
  myScore: number;
  opponentScore: number;
  symbol: string;
  enemySymbol: string;
  lastWin: string
};

const Game = ({ socket }: { socket: any }) => {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId!;
  const { user } = useUser();
  const [moves, setMoves] = useState<{ move: number; myMove: boolean }[]>(Array(9).fill({ move: -1, myMove: false }));
  const [gameState, setGameState] = useState<GameState>({
    isLoading: true,
    loadingValue: 'waiting for another player...',
    userJoined: false,
    userTurn: false,
    opponentName: '',
    yourName: '',
    move: null,
    allMoves: [],
    winner: '',
    winnerId: '',
    winPattern: [],
    gameEnd: false,
    leaveRoom: false,
    myScore: 0,
    opponentScore: 0,
    symbol: '',
    enemySymbol: '',
    lastWin:''
  });

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
      return;
    }

    socket.emit('usersEntered', { roomId, userId: user.userId });

    socket.off('usersEntered').on('usersEntered', (data: any) => {
      setGameState(prevState => ({
        ...prevState,
        isLoading: false,
        userJoined: true,
        userTurn: true,
        opponentName: data.user1.userId !== user.userId ? data.user1.username : data.user2.username,
        yourName: data.user1.userId === user.userId ? data.user1.username : data.user2.username,
        symbol: data.user1.userId === user.userId ? 'X' : 'O',
        enemySymbol: data.user1.userId !== user.userId ? 'X' : 'O',
      }));
    });
  }, [socket, user, roomId]);

  const handleMoveClick = (index: number) => {
    if (gameState.isLoading || !gameState.userJoined || !gameState.userTurn || moves[index].move !== -1) return;
    socket.emit('move', { move: index, roomId, userId: user!.userId });
  };

  const incrementScore = (player: boolean) => {
    setGameState(prevState => ({
      ...prevState,
      myScore: player ? prevState.myScore + 1 : prevState.myScore,
      opponentScore: !player ? prevState.opponentScore + 1 : prevState.opponentScore
    }));
  }

  useEffect(() => {
    socket.on('move', (payload: any) => {
      if (user) {
        const newMoves = [...moves];
        newMoves[payload.move] = { move: payload.move, myMove: payload.userId === user.userId };

        setMoves(newMoves);
        setGameState(prevState => ({
          ...prevState,
          move: { move: payload.move, myMove: payload.userId === user.userId },
          allMoves: [...prevState.allMoves, { move: payload.move, myMove: payload.userId === user.userId }],
          userTurn: payload.userId !== user.userId,
        }));
      }
    });

    socket.on('win', (payload: { pattern: number[]; userId: string; username: string }) => {
      if (!user) return;

      setGameState(prevState => ({
        ...prevState,
        winPattern: payload.pattern,
        gameEnd: true,
        winnerId: payload.userId,
        userTurn: true,
        winner: payload.userId === user.userId ? 'You won!' : `You lost! ${payload.username} as ${gameState.symbol} won!`,
        lastWin:payload.userId === user.userId ?  gameState.yourName : payload.username
      }))
    });

    socket.on('draw', () => {
      setGameState(prevState => ({
        ...prevState,
        winner: 'Draw!',
        gameEnd: true,
        userTurn: false,
        loadingValue: '',
      }));
    });

    socket.on('reMatch', () => {
      setMoves(Array(9).fill({ move: -1, myMove: false }));
      setGameState(prevState => ({
        ...prevState,
        winner: '',
        userTurn: true,
        gameEnd: false,
      }));
    });

    socket.on('removeRoom', () => {
      setGameState(prevState => ({
        ...prevState,
        userJoined: false,
        leaveRoom: true,
      }));
    });

    socket.on('userLeave', () => {
      setGameState(prevState => ({
        ...prevState,
        loadingValue: `${prevState.opponentName} left the game. Going back to Home Page`,
        isLoading: true,
        userJoined: false,
      }));
      window.location.reload();
    });
  }, [socket, user, moves]);

  const handlePlayAgain = () => {
    socket.emit('reMatch', { roomId });
  };

  const handleClose = () => {
    socket.emit('removeRoom', { roomId });
    return true;
  };

  return (
    <div className="relative mb-[10px] max-w-[300px] h-[788px] mx-auto mt-16 text-center">
      <div className="text-[1rem]">
        <p>
          {gameState.symbol} {gameState.yourName} vs {gameState.opponentName} {gameState.enemySymbol}
        </p>
         {gameState.lastWin!==''?
         <p> Last winner: {gameState.lastWin}</p>:
         <p>Good luck</p>}
      </div>
      <div className="grid max-w-[280px] grid-cols-[auto_auto_auto] p-[10px] justify-center">
        {Array.from({ length: 9 }, (_, i) => {
          const className = `relative p-[30px] text-[24px] w-[60px] h-[60px] lg:w-[100px] lg:h-[100px] text-center text-black border-2 border-black`;
          const move = moves[i];

          return (
            <div
              key={i}
              onClick={move.move === -1 && !gameState.winner && gameState.userTurn ? () => handleMoveClick(i) : undefined}
              className={move.move === -1 ? `hover:bg-[#00000007] ${className}` : className}>
              {move.move !== -1 ? (move.myMove ? gameState.symbol : gameState.enemySymbol) : null}
            </div>
          );
        })}
      </div>
      {gameState.isLoading ? <div className="isLoading">{gameState.loadingValue}</div> : null}
      {gameState.userTurn ? <div className="isLoading">{`Your turn ${gameState.symbol}`}</div> : null}
      {gameState.gameEnd ? (
        <div className="game-end">
          {!gameState.leaveRoom ? (
            <button
              onClick={handlePlayAgain}
              className="bg-black my-2 rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black">
                Play Again
            </button>
          ) : null}
          <form onSubmit={handleClose} action="/">
            <button className="bg-black rounded-lg text-white py-2 px-4 text-sm font-bold cursor-pointer transition-all duration-200 ease-in-out hover:bg-transparent hover:text-black border-2 border-black">
              Close
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Game;
