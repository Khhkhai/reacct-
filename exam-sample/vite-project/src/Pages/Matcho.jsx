import { useState } from "react";

export const Matcho = () => {
    const cards = ["🍎", "🍎", "🚗", "🚗", "⭐", "⭐", "🎵", "🎵", 
                        "🐶", "🐶", "⚽", "⚽", "🍩", "🍩", "🌙", "🌙"]
     const [grid, setGrid] = useState(() =>
    [...cards].sort(() => Math.random() - 0.5)
  );
  const [opened, setOpened] = useState([]);   // currently flipped cards
  const [matched, setMatched] = useState([]); // permanently matched cards
  const [lock, setLock] = useState(false);    // stop clicking during timeout
  const handleClick = (index) => {
    if (lock) return;
    if (opened.includes(index)) return;
    if (matched.includes(index)) return;
    const newOpened = [...opened, index];
    setOpened(newOpened);
    // first card clicked

    if (newOpened.length === 1) return;
    // second card clicked
    const firstIndex = newOpened[0];
    const secondIndex = newOpened[1];
    const firstCard = grid[firstIndex];
    const secondCard = grid[secondIndex];
    // MATCH
    if (firstCard === secondCard) {
      setMatched((prev) => [...prev, firstIndex, secondIndex]);
      setOpened([])
    } 

    // NOT MATCH
    else {
      setLock(true);
      setTimeout(() => {
        setOpened([]);
        setLock(false);
      }, 800);
    }
  };

  const restartGame = () => {
    setGrid([...cards].sort(() => Math.random() - 0.5));
    setOpened([]);
    setMatched([]);
    setLock(false);
  };

  const isVisible = (index) => {
    return opened.includes(index) || matched.includes(index);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">Memory Game</h1>
      <div className="grid grid-cols-4">
        {grid.map((card, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-20 h-20 text-3xl border bg-white shadow"
          >
            {isVisible(index) ? card : ""}
          </button>
        ))}
      </div>

      <button
        onClick={restartGame}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Restart
      </button>

      {matched.length === grid.length && (
        <p className="text-green-600 font-bold text-xl">You Win 🎉</p>
      )}
    </div>
  );
}