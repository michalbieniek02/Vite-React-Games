type User = {
  socketId: string;
  roomId: string;
};

type GameDetail = {
  room: string;
  user1: Player;
  user2: Player;
};

type Player = {
  userId: string;
  username: string;
  moves: number[];
  winCount: number;
  inGame: boolean;
};

const users: User[] = [];
const gameDetail: GameDetail[] = [];

function addUser(socketId: string, roomId: string){
  users.push({ socketId, roomId });
}

function getCurrentUser(id: string){
  return users.find(user => user.socketId === id);
}

function findUserById(id: string){
  return users.find(user => user.socketId === id);
}

function userLeave(id: string){
  const index = users.findIndex(user => user.socketId === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function addRoom(room: string){
  let isRoomExist = gameDetail.find(item => item.room === room);
  if (!isRoomExist) {
    gameDetail.push({
      room,
      user1: { userId: '', username: '', moves: [], winCount: 0, inGame: false },
      user2: { userId: '', username: '', moves: [], winCount: 0, inGame: false },
    });
  }
}

function newGame(room: string, userId: string, username: string){
  let isRoomExist = gameDetail.find(item => item.room === room);
  if (!isRoomExist) {
    gameDetail.push({
      room,
      user1: { userId, username, moves: [], winCount: 0, inGame: false },
      user2: { userId: '', username: '', moves: [], winCount: 0, inGame: false },
    });
    return true;
  }
  if (isRoomExist.user2.userId === '' && isRoomExist.user1.userId !== userId) {
    isRoomExist.user2.userId = userId;
    isRoomExist.user2.username = username;
    return true;
  }
  return false;
}

function getGameDetail(room: string){
  return gameDetail.find(item => item.room === room);
}

function addMove(room: string, move: number){
  let game = getGameDetail(room);
  if (game) {
    let player = game.user1.userId ? game.user1 : game.user2;
    player.moves.push(move);
  }
}

const winPatterns: number[][] = [
  [0,1,2], [3,4,5],
  [6,7,8], [0,3,6],
  [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

function CheckWin(room:string, userId:string) {
  let gameDetail = getGameDetail(room);
  if (!gameDetail) return
    
  let user = 2;
  let currUserMoves = gameDetail.user2.moves;
  
  if(gameDetail.user1.userId==userId){
    user = 1;
    currUserMoves = gameDetail.user1.moves;
  }
  
  let pattern:any;
  let isWin = false;
  for(let i=0; i<winPatterns.length; i++){
    let win_pattern = winPatterns[i];
    isWin = true;
    for(let j=0; j<win_pattern.length; j++){
      if(!currUserMoves.includes(win_pattern[j])){
        isWin = false;
      }
    }
    if(isWin){
      pattern = i;
      if(user===1){
        gameDetail.user1.winCount = gameDetail.user1.winCount +1;
        break;
      }
      gameDetail.user2.winCount = gameDetail.user2.winCount +1;
      break;
    }
  }

  return {isWin, pattern};
}

function userLeft(socketId: string){
  let user = findUserById(socketId);
  if (!user) {
    return;
  }

  let roomId = user.roomId;
  let userIndex = users.findIndex(u => u.socketId === socketId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }
  return roomId;
}

export {
  getCurrentUser,
  userLeave,
  addRoom,
  addMove,
  getGameDetail,
  newGame,
  CheckWin,
  addUser,
  userLeft,
};
