import { useState, useEffect, useRef, type ChangeEvent } from "react";
import "./App.css";

const wordList = [
  "quail",
  "suborn",
  "alcove",
  "apostate",
  "macabre",
  "occluded",
  "desiccant",
  "waft",
  "plethora",
];

function App() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [word, setWord] = useState("");
  const [index, setIndex] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const countRef = useRef<number>(null);

  const handleStart = () => {
    const startTime = Date.now();
    if (countRef.current) {
      clearInterval(countRef.current);
    }

    countRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 10);
  };

  const resetGame = () => {
    setIndex(Math.floor(Math.random() * wordList.length));
    setWord("");
    setHasWon(false);
    const input = document.getElementById("word-input");
    if (input) {
      input.focus();
    }
    handleStart();
  };

  useEffect(() => {
    handleStart();
  }, []);

  const handleStop = () => {
    if (countRef.current) {
      clearInterval(countRef.current);
    }
  };

  const textOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (hasWon) return;

    setWord(e.target.value);
    if (e.target.value === wordList[index]) {
      setHasWon(true);
      handleStop();
    }
  };

  return (
    <div className="container">
      <h3>Please enter the following word as fast as possible</h3>
      <span className="word-display">{wordList[index]}</span>
      <input id="word-input" type="text" value={word} onChange={textOnChange} />
      <button onClick={resetGame}>Reset</button>
      {<div>Elapsed time: {elapsedTime / 1000} seconds</div>}
    </div>
  );
}

export default App;
