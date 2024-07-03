
const users = [];
const gameDetail = [];


function addUser(socketId, roomId) {
  users.push({socketId, roomId});
}

function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function findUserById(id){
  return users.find(user => user.socketId ===id)
 }

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}


function addRoom(room) {
  let isRoomExsist = game.find(item => item.room === room);
  if(!isRoomExsist) {
    game.push({ 
      room,
      users:[],
      moves: {} 
    });
  }
}


function newGame (room, userId, username) {
  
  let isRoomExsist = gameDetail.find(item => item.room === room);
  if(!isRoomExsist) {
    gameDetail.push({room, user1:{userId , username, moves: [], winCount:0, inGame:false}, user2:{userId:0 , username:0, moves: [], winCount:0, inGame:false}});
    return;
  }
    if(isRoomExsist.user2.userId === 0 && isRoomExsist.user1.userId != userId){
      isRoomExsist.user2.userId = userId;
      isRoomExsist.user2.username = username;
      return true;
    }
      return false;
    
}

function getGameDetail(room) {
  return gameDetail.find(item => item.room === room)
}

function addMove(room, userId, move) {
  let gameDetail = getGameDetail(room);
  gameDetail.moves.push(move);
}

const winPatterns = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

function CheckWin(room, userId) {
  let gameDetail = getGameDetail(room);

  let user = 2;
  let currUserMoves = gameDetail.user2.moves;
  let winCount;
  
  if(gameDetail.user1.userId==userId){
    user = 1;
    currUserMoves = gameDetail.user1.moves;
  }
  
  let pattern;
  let isWin;
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
        winCount = gameDetail.user1.winCount;
        break;
      }
      gameDetail.user2.winCount = gameDetail.user2.winCount +1;
      winCount = gameDetail.user1.winCount;
      break;
    }
  }

  return {isWin,winCount, pattern};
}

function removeRoom(room) {
  let index = gameDetail.findIndex(item => item.room === room);
  if(index !== -1){
    return gameDetail.splice(index, 1)[0];
  }
}


function userLeft(socketId) {
  if(!findUserById(socketId)){
    return;
  }
  let roomId = findUserById(socketId).roomId;
  let index = findUserById(socketId)
  if(index !== -1){
    users.splice(index, 1)[0];
  }
  removeRoom(roomId);
  return roomId;
}


module.exports = {
  getCurrentUser,
  userLeave,
  addRoom,
  addMove,
  getGameDetail,
  newGame,
  CheckWin,
  removeRoom,
  addUser,
  userLeft
};