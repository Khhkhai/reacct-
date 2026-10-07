import { useState } from 'react'
import './App.css'

function App() {
  const emptyBoard = [[2,null,null,null],
                        [null,null,null,null],
                        [null,null,null,null],
                        [null,null,null,null]]

  const [board, setBoard] = useState(emptyBoard)

  const handleKeyPress = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveUp()
            break;
        case 'ArrowDown':
            moveDown()
            break;
        case 'ArrowLeft':
            moveLeft()
            break;
        case 'ArrowRight':
            moveRight() 
            break;
        default:
            break;
    }
  }
  const chooseNumber = () => {
    return Math.random() < 0.5 ? 2 : 4;
  }

  const chooseEmptyCell = (b) => {
    const emptyCells = [];
    b.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === null) {
                emptyCells.push({ r: rowIndex, c: colIndex });
            }
        });
    });

    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        return [randomCell.r, randomCell.c];
    } else {
        return [null, null]
    } 
  }

  const addNumberToCell = (b) => {
    const num = chooseNumber();
    const [r, c] = chooseEmptyCell(b);
    if (r == null || c === null) {
        return
    }
    const newBoard = b.map(row => [...row])
    newBoard[r][c] = num
    return newBoard
  }

  const moveRight = () => {
    let change = false
    let newBoard = board.map(row => [...row])
    for (let row in newBoard) {
        const values = newBoard[row]
        let nonEmpty = values.filter(cell => cell !== null) as number[]
        for (let i = nonEmpty.length - 1; i > 0; i--) {
            if (nonEmpty[i] === nonEmpty[i - 1]) {
                nonEmpty[i] *= 2;
                nonEmpty.splice(i - 1, 1)
                change = true
            }
        }
        while (nonEmpty.length < 4) {
            nonEmpty.unshift(null);
        }
        if (values.some((cell, i) => cell !== nonEmpty[i])) {
            change = true
        }
        newBoard[row] = nonEmpty
    }
    if (newBoard === board) {
        return
    }
    if (change) {
        newBoard = addNumberToCell(newBoard)
        setBoard(newBoard)
    }
  }

  const moveLeft = () => {
    let change = false
    let newBoard = board.map(row => [...row])
    for (let row in newBoard) {
        const values = newBoard[row]
        let nonEmpty = values.filter(cell => cell !== null) as number[]
        for (let i = 0; i <  nonEmpty.length; i++) {
            if (nonEmpty[i] === nonEmpty[i + 1]) {
                nonEmpty[i] *= 2;
                nonEmpty.splice(i + 1, 1) 
                change = true
            }
        }
        while (nonEmpty.length < 4) {
            nonEmpty.push(null);
        }
        if (values.some((cell, i) => cell !== nonEmpty[i])) {
            change = true
        }
        newBoard[row] = nonEmpty
    }
    if (change) {
        newBoard = addNumberToCell(newBoard)
        setBoard(newBoard)
    }

  }

  const moveDown = () => {
    let change = false
    let newBoard = board.map(row => [...row])
    for (let col in newBoard) {
        let values = []
        for (let i = 0; i < 4; i++) {
            values.push(newBoard[i][col])
        }
        let nonEmpty = values.filter(cell => cell !== null) as number[]
        for (let i = nonEmpty.length - 1; i > 0; i--) {
            if (nonEmpty[i] === nonEmpty[i - 1]) {
                nonEmpty[i] *= 2;
                nonEmpty.splice(i - 1, 1)
                change = true
            }
        }
        while (nonEmpty.length < 4) {
            nonEmpty.unshift(null);
        }
        if (values.some((cell, i) => cell !== nonEmpty[i])) {
            change = true
        }
        for (let i = 0; i < 4; i++) {
            newBoard[i][col] = nonEmpty[i]
        }
    }
    if (change) {
        newBoard = addNumberToCell(newBoard)
        setBoard(newBoard)
    }
  }

  const moveUp = () => {
    let change = false
    let newBoard = board.map(row => [...row])
    for (let col in newBoard) {
        let values = []
        for (let i = 0; i < 4; i++) {
            values.push(newBoard[i][col])
        }
        let nonEmpty = values.filter(cell => cell !== null) as number[]
        for (let i = 0; i < nonEmpty.length; i++) {
            if (nonEmpty[i] === nonEmpty[i + 1]) {
                nonEmpty[i] *= 2;
                nonEmpty.splice(i + 1, 1)
                change = true
            }
        }
        while (nonEmpty.length < 4) {
            nonEmpty.push(null);
        }
        if (values.some((cell, i) => cell !== nonEmpty[i])) {
            change = true
        }
        for (let i = 0; i < 4; i++) {
            newBoard[i][col] = nonEmpty[i]
        }
    }
    if (change) {
        newBoard = addNumberToCell(newBoard)
        setBoard(newBoard)
    }
  }
  return (
    <>
     <div >
        <div
            className="grid grid-cols-4 gap-3 bg-[#bbada0] p-3 rounded-2xl shadow-xl aspect-square w-[420px] select-none outline-none"
            tabIndex={0}
            onKeyDown={(e) => {
                handleKeyPress(e);
            }}
            >
            {board.map((row, rowIndex) =>
                row.map((col, colIndex) => {
                const value = col;

                const tileColors = {
                    null: "bg-[#cdc1b4] text-transparent",
                    2: "bg-[#eee4da] text-[#776e65]",
                    4: "bg-[#ede0c8] text-[#776e65]",
                    8: "bg-[#f2b179] text-white",
                    16: "bg-[#f59563] text-white",
                    32: "bg-[#f67c5f] text-white",
                    64: "bg-[#f65e3b] text-white",
                    128: "bg-[#edcf72] text-white text-3xl",
                    256: "bg-[#edcc61] text-white text-3xl",
                    512: "bg-[#edc850] text-white text-3xl",
                    1024: "bg-[#edc53f] text-white text-2xl",
                    2048: "bg-[#edc22e] text-white text-2xl",
                };

                return (
                    <div
                    key={`key-${rowIndex}-${colIndex}`}
                    className={`
                        flex items-center justify-center
                        rounded-xl font-bold
                        text-4xl
                        transition-all duration-200
                        shadow-sm
                        w-20 h-20
                        ${
                        tileColors[value] ||
                        "bg-black text-white text-xl"
                        }
                    `}
                    >
                    {value ?? ""}
                    </div>
                );
                })
            )}
            </div>
     </div>
      
    </>
  )
}

export default App
