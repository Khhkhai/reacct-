import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [player, setPlayer] = useState('X')
  const [board, setBoard] = useState([['','',''], 
                                       ['','',''], 
                                       ['','','']])
  const [winner, setWinner] = useState('')
  const [winningPos, setWinningPos] = useState([])
  const [winCount, setWinCount] = useState([{winner: '', count: '0'}])
  
  useEffect(() => {
    if (!localStorage.getItem("X")) {
      localStorage.setItem("X", "0");
    }
    if (!localStorage.getItem("O")) {
      localStorage.setItem("O", "0");
    }
  }, []);

  const updateWinnerScore = (player) => {
    const score = parseInt(localStorage.getItem(player) ?? "0");
    localStorage.setItem(player, (score+1).toString());
  }

  const checkCellEmpty = (row, col) => {
    if (board[row][col] == '') {
        return true
    } else {
        return false
    }
  }

  const assignPlayer = (row, col) => {
    if (! checkCellEmpty(row, col)) {
        return 
    }
    const newBoard = board.map(row => ([...row]))
    newBoard[row][col] = player
    setBoard(newBoard)
    checkWin(newBoard)

    setPlayer(player == 'X' ? '0' : 'X')
  }

  const checkWin = (newBoard) => {
    const winCon = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],


        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],

        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ]

    for (const line of winCon) {
        const [a, b, c] = line;
        if (newBoard[a[0]][a[1]] !== "" &&
        newBoard[a[0]][a[1]] === newBoard[b[0]][b[1]] &&
        newBoard[b[0]][b[1]] === newBoard[c[0]][c[1]]) {
            setWinner(player === "X" ? "X" : "O")
            setWinningPos([a, b, c])
            updateWinnerScore(player)
        }
    }
  }

  const isWin = winner !== ''

  const isWinPlace = (row_index, col_index) => {
    if (winner) {
        return winningPos.some((cell) => cell[0] === row_index && cell[1] === col_index) 
    }
    return false
  }

  return (
    <>
        <div className='flex flex-col items-center'>
            <div className='grid grid-cols-3 aspect-square w-md gap-0.5 bg-black'>
                {board.map((row, row_index) => (
                    row.map ((col, col_index) => (
                        <button className={isWinPlace(row_index, col_index) ? 'bg-green-300' : 'bg-gray-100'} 
                                onClick={() => assignPlayer(row_index, col_index)}
                                disabled={winner || ! checkCellEmpty ? true : false}
                        >
                            {col}
                        </button>
                    ))
                ))}
            </div>   
            <p className='text-center'>Win player: {winner}</p>
        </div>
        
    </>
  )
}

export default App
