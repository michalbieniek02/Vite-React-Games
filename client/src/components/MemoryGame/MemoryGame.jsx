import React, { useState, useEffect } from 'react';
import Stopwatch from '../Stopwatch';

const generateGrid = () => {
  const gridSize = 4;
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
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (selected.length !== 2) {
      return;
    }
    const [first, second] = selected;
    if (grid[first].value === grid[second].value) {
      setGrid((prevGrid) =>
        prevGrid.map((cell, idx) =>
          idx === first || idx === second ? { ...cell, matched: true } : cell
        ));
    } else {
      setTimeout(() => {
        setGrid((prevGrid) =>
          prevGrid.map((cell, idx) =>
            idx === first || idx === second ? { ...cell, revealed: false } : cell
          ));
      }, 1000);
    }
    setTimeout(() => setSelected([]), 10); 
  }, [selected, grid]);

  useEffect(() => {
    if (grid.every(cell => cell.matched)) {
      setGameCompleted(true);
      setStartTime(false);
    }
  }, [grid]);

  const handleClick = (index) => {
    if (!startTime && !gameCompleted) {
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

  const resetGame = () => {
    setGrid(generateGrid());
    setSelected([]);
    setStartTime(false);
    setGameCompleted(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center mt-5 mb-7 h-[784px]">
      <Stopwatch start={startTime} stop={gameCompleted} />
      <div className="grid grid-cols-4 grid-rows-4 gap-2.5 justify-center">
        {grid.map((cell, index) => (
          <div
            key={index}
            className={`flex justify-center items-center w-20 h-20 border border-gray-800 bg-gray-200 text-2xl cursor-pointer select-none ${cell.revealed || cell.matched ? 'bg-white cursor-default' : ''}`}
            onClick={() => handleClick(index)}
          >
            {cell.revealed || cell.matched ? cell.value : '?'}
          </div>
        ))}
      </div>
      {gameCompleted && (
        <button className="mt-5 px-5 py-2 text-lg cursor-pointer" onClick={resetGame}>
          Reset Game
        </button>
      )}
    </div>
  );
};

export default MemoryGame;
