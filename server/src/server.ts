import { Request, Response } from 'express';
import { Socket } from 'socket.io'
const app = require('express')();
const dotenv = require('dotenv');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})
dotenv.config({ path: './config.env' });

import { getGameDetail, addUser, userLeft, newGame, CheckWin} from './users';


io.on('connection', (socket:Socket)=>{
    socket.on('joinRoom', (payload:any)=>{
        addUser(socket.id, payload.roomId);

        const user = {socketId:socket.id, username:payload.username, roomId:payload.roomId};
        newGame(payload.roomId, payload.userId, payload.username);
        socket.join(user.roomId);
    })

    socket.on('joinExistingRoom', (payload:any)=>{
        addUser(socket.id, payload.roomId);
        const user = {socketId:socket.id, username:payload.username, roomId:payload.roomId};
        const roomExists = getGameDetail(payload.roomId);
        if(!roomExists){
            socket.emit('message', {error:'Room does not exist'});
            return;
        }

        if(!newGame(payload.roomId, payload.userId, payload.username)){
            socket.emit('message', {error:'Room is full'});
            return;
        }
        
        socket.join(user.roomId);
        socket.emit('message', 'Welcome to ChatCord!');
        socket.to(payload.roomId).emit('userJoined',`${payload.username} has joined the chat`);
        return;
    })

    socket.on('usersEntered', (payload:any) => {
        const current_game = getGameDetail(payload.roomId);

        if (!current_game) return;

        if (current_game.user1.userId === payload.userId) {
            current_game.user1.inGame = true;
        } 
        if (current_game.user2.userId === payload.userId) {
            current_game.user2.inGame = true;
        }

        if (current_game.user1.inGame && current_game.user2.inGame) {
            io.in(payload.roomId).emit('usersEntered', { user1: current_game.user1, user2: current_game.user2 });
        }
    });
    
    socket.on('move', async(payload:any)=>{
       
        const current_room =  await getGameDetail(payload.roomId);
        let current_username:string;
        let moveCount:number;

        if(!current_room!.user1.userId || !current_room!.user2.userId){
            io.in(payload.roomId).emit('userLeave',{});
        }
        
        if(current_room!.user1.userId == payload.userId){
            current_room!.user1.moves.push(payload.move);
            moveCount = current_room!.user1.moves.length;
            current_username = current_room!.user1.username;
        }
        else {
            current_room!.user2.moves.push(payload.move);
            moveCount = current_room!.user2.moves.length;
            current_username = current_room!.user2.username;
        }

        io.in(payload.roomId).emit('move',{move:payload.move, userId:payload.userId});

        if(moveCount<3) return
        
        const winPayload = CheckWin(payload.roomId, payload.userId.toString());
        if (!winPayload) return
        let winPattern = winPayload.pattern

        if (winPayload.isWin) {
            io.in(payload.roomId).emit('win', { userId: payload.userId, username: current_username, winPattern });
            return;
          }
        if(current_room!.user1.moves.length + current_room!.user2.moves.length >= 9){
            io.in(payload.roomId).emit('draw', {roomId:payload.roomId});
            return;
        }
    });

    socket.on('reMatch', (payload:any)=>{
        let currGameDetail = getGameDetail(payload.roomId);

        currGameDetail!.user1.moves = [];
        currGameDetail!.user2.moves = [];
        io.in(payload.roomId).emit('reMatch',{currGameDetail});
    })

    socket.on('disconnect', ()=>{
        const roomId = userLeft(socket.id);
        io.in(roomId).emit('userLeave',{roomId});
    })
})

app.get('/', (req:Request, res:Response)=>{
    res.send('Server is running');
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})