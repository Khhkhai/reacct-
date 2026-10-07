
import { useEffect, useState } from "react";

export const strs = [
  "the fat cats",
  "larger frogs",
  "banana cakes",
  "unsw vs usyd",
  "french toast",
  "hawaii pizza",
  "barack obama",
];

export const Blanko = () => {
  const [answer, setAnswer] = useState([]);
  const [word, setWord] = useState([]);
  const [blankIndexes, setBlankIndexes] = useState([]);

  // Create new puzzle
  const buildString = () => {
    const selected = strs[Math.floor(Math.random() * strs.length)];
    const letters = [...selected];

    const validIndexes = letters
      .map((char, index) => (char !== " " ? index : null))
      .filter((x) => x !== null);

    const randomThree = [...validIndexes]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const displayWord = letters.map((char, index) =>
      randomThree.includes(index) ? "" : char
    );

    setAnswer(letters);
    setWord(displayWord);
    setBlankIndexes(randomThree);
  };

  useEffect(() => {
    buildString();
  }, []);

  const handleSetInput = (value, index) => {
    const char = value.slice(-1);

    const updated = word.map((item, i) =>
      i === index ? char : item
    );

    setWord(updated);

    const solved = answer.every((char, i) => updated[i] === char);

    if (solved) {
      alert("Correct!");
      buildString();
      const currentScore = parseInt(localStorage.getItem('score'), 10)
      localStorage.setItem('score', String(currentScore + 1))
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex m-auto border">
        {word.map((char, index) =>
          blankIndexes.includes(index) ? (
            <div key={index} className="flex flex-col">
              <input
                className="flex w-12 h-10 border p-3 items-center justify-center" 
                value={word[index]}
                onChange={(e) =>
                  handleSetInput(e.target.value, index)
                }
              />
              <div className="w-12 h-2 border"></div>
            </div>
          ) : (
            <div
              key={index}
              className="w-12 h-12 border flex items-center justify-center"
            >
              {char}
            </div>
          )
        )}
      </div>
      <div className="text-center p-3">
        <button className="btn btn-sm" onClick={buildString}>reset</button>

      </div>

    </div>
  );
};
