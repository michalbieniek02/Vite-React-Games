import React from 'react';
import Home from './components/Home/Home';
import CreateRoom from './components/CreateRoom/CreateRoom';
import JoinRoom from './components/JoinRoom/JoinRoom';
import Game from './components/Game/Game';
import Footer from './components/Footer.jsx';
import MobileFooter from './components/MobileFooter.jsx';
import NotFound from './components/NotFound/NotFound';
import NavBar from './components/NavBar.jsx'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import MemoryGame from './sites/MemoryGame.jsx'

const socket = io.connect('http://localhost:3000');
// const socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);

function App() {

  // const {user} = useSelector(state => state.user)

  return (
    <div className="App">
      <header className="App-header">

    <Router>
      <NavBar/>
      <Routes>
      <Route path='/' element={<Home />}></Route>
        <Route path='/createRoom' element={<CreateRoom socket={socket}/>}></Route>
        <Route path='/joinRoom' element={<JoinRoom socket={socket}/>}></Route>
        <Route path='/game/:roomId' element={<Game socket={socket}/>}></Route>
        <Route path="/memory" element={<MemoryGame/>}/>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
      <MobileFooter/>
      <Footer/>
    </Router>


      </header>
    </div>
  );
}

export default App;