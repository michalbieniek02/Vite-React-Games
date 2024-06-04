import './App.scss';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Home from './sites/Home';
import MemoryGame from './sites/MemoryGame';
import TicTacToe from './sites/TicTacToe';
import {Route,Routes} from 'react-router-dom'
const App = () => {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/tic-tac-toe" element={<TicTacToe/>}/>
      <Route path="memory" element={<MemoryGame/>}/>
    </Routes>
    <Footer/>
    </>
  )
}

export default App;
