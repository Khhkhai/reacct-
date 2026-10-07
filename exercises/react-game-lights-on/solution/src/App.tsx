import { useState } from "react";
import "./App.css";

function App() {
  const generateRandomBoard = () =>
    Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => Math.random() > 0.5),
    );

  const [board, setBoard] = useState(generateRandomBoard());
  const [hasWon, setHasWon] = useState(false);

  const resetGame = () => {
    setBoard(generateRandomBoard());
    setHasWon(false);
  };

  const cellClicked = (i: number, j: number) => () => {
    if (hasWon) return;

    const newBoard = board.map((row) => row.slice());
    newBoard[i][j] = !newBoard[i][j];
    if (i > 0) newBoard[i - 1][j] = !newBoard[i - 1][j];
    if (i < 4) newBoard[i + 1][j] = !newBoard[i + 1][j];
    if (j > 0) newBoard[i][j - 1] = !newBoard[i][j - 1];
    if (j < 4) newBoard[i][j + 1] = !newBoard[i][j + 1];
    setBoard(newBoard);
    checkGameHasWon(newBoard);
  };

  const checkGameHasWon = (newBoard: boolean[][]) => {
    setHasWon(newBoard.every((row) => row.every((cell) => cell)));
  };

  return (
    <>
      <div className="container">
        {board.map((row, i) => (
          <div key={i}>
            {row.map((cell, j) => (
              <div
                key={j}
                className={cell ? "cell" : "cell off"}
                onClick={cellClicked(i, j)}
              />
            ))}
          </div>
        ))}
      </div>
      {hasWon && <div>Congrats!</div>}
      <button onClick={resetGame}>Reset</button>
    </>
  );
}

export default App;
