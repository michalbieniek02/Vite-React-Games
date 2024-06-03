import React from 'react'
import Square from './Square';

const Board = ({ squares, onClick, turn }) => (
  <div>
    <div className="board-row">
      {squares.slice(0, 3).map((square, index) => (
        <Square key={index} value={square} onClick={() => onClick(index)} turn={turn} />
      ))}
    </div>
    <div className="board-row">
      {squares.slice(3, 6).map((square, index) => (
        <Square key={index} value={square} onClick={() => onClick(index + 3)} turn={turn} />
      ))}
    </div>
    <div className="board-row">
      {squares.slice(6, 9).map((square, index) => (
        <Square key={index} value={square} onClick={() => onClick(index + 6)} turn={turn} />
      ))}
    </div>
  </div>
);

export default Board