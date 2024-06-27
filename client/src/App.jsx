// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar.jsx';
import Home from './components/Home/Home';
import CreateRoom from './components/CreateRoom/CreateRoom';
import JoinRoom from './components/JoinRoom/JoinRoom';
import Game from './components/Game/Game';
import MemoryGame from './sites/MemoryGame.jsx';
import Footer from './components/Footer/Footer.jsx';
import MobileFooter from './components/Footer/MobileFooter.jsx';
import NotFound from './components/NotFound/NotFound';
import io from 'socket.io-client';

const socket = io.connect(import.meta.env.VITE_BACKEND_URL);

function App() {
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
        <Footer />
      </footer>
    </div>
  );
}

export default App;
