
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar.js';
import Home from './components/Home/Home.js';
import CreateRoom from './components/CreateRoom/CreateRoom.js';
import JoinRoom from './components/JoinRoom/JoinRoom.js';
import Game from './components/Game/Game.js';
import MemoryGame from './components/MemoryGame/MemoryGame.js';
import MobileFooter from './components/Footer/MobileFooter.js';
import NotFound from './components/NotFound/NotFound.js';
import io from 'socket.io-client';


const App: React.FC = () =>{
  //const socket = io(process.env.REACT_APP_SOCKET_URL);
  const socket = io('http://10.100.100.157:3000/');
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <NavBar />
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/createRoom' element={<CreateRoom socket={socket} />}></Route>
            <Route path='/joinRoom' element={<JoinRoom socket={socket} />}></Route>
            <Route path='/game/:roomId' element={<Game socket={socket} />}></Route>
            <Route path="/memory" element={<MemoryGame />} />
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </Router>
      </header>
      <footer>
        <MobileFooter />
      </footer>
    </div>
  );
}

export default App;
