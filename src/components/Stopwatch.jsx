import React, { useState, useEffect, useRef } from 'react';

const Stopwatch = ({ start }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (start) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 10);
    }
    return () => clearInterval(timerRef.current);
  }, [start]);

  const hours = Math.floor(elapsedTime / 360000);
  const minutes = Math.floor((elapsedTime % 360000) / 6000);
  const seconds = Math.floor((elapsedTime % 6000) / 100);
  const milliseconds = elapsedTime % 100;

  return (
    <div className="stopwatch" style={{justifyContent:'center',marginTop:'40px',fontSize:'20px'}}>
      
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      
    </div>
  );
};

export default Stopwatch;
