import React, { useState, useEffect } from 'react';
import Stopwatch from '../components/Stopwatch';
import '../styles/MemoryGame.scss';

const generateGrid = () => {
  const gridSize = 6;
  const numPairs = (gridSize * gridSize) / 2; 
  const values = Array.from({ length: numPairs }, (_, i) => i + 1).flatMap((n) => [n, n]);
  values.sort(() => Math.random() - 0.5);
  return values.map((value, index) => ({
    id: index,
    value,
    revealed: false,
    matched: false,
  }));
};

const MemoryGame = () => {
  const [grid, setGrid] = useState(generateGrid);
  const [selected, setSelected] = useState([]);
  const [startTime, setStartTime] = useState(false);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (grid[first].value === grid[second].value) {
        setGrid((prevGrid) =>
          prevGrid.map((cell, idx) =>
            idx === first || idx === second
              ? { ...cell, matched: true }
              : cell
          )
        );
      } else {
        setTimeout(() => {
          setGrid((prevGrid) =>
            prevGrid.map((cell, idx) =>
              idx === first || idx === second
                ? { ...cell, revealed: false }
                : cell
            )
          );
        }, 1000);
      }
      setTimeout(() => setSelected([]), 1); 
    }
  }, [selected, grid]);

  const handleClick = (index) => {
    if (!startTime) {
      setStartTime(true);
    }

    if (selected.length < 2 && !grid[index].revealed && !grid[index].matched) {
      setGrid((prevGrid) =>
        prevGrid.map((cell, idx) =>
          idx === index ? { ...cell, revealed: true } : cell
        )
      );
      setSelected((prevSelected) => [...prevSelected, index]);
    }
  };

  return (
    <div className="memory-game-container">
      <Stopwatch start={startTime} />
      <div className="memory-game">
        {grid.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell.revealed || cell.matched ? 'revealed' : ''}`}
            onClick={() => handleClick(index)}
          >
            {cell.revealed || cell.matched ? cell.value : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
