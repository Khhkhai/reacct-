import { useEffect, useState } from "react";

export const Tetro = () => {
    const ROWS = 12;
    const COLS = 10;

    const makeGrid = () =>
        Array.from({ length: ROWS }, () => Array(COLS).fill(""));

    const shapes = [
        [[0, 0], [0, 1], [1, 0], [1, 1]], // 2x2
        [[0, 0], [1, 0]],                 // 2x1
        [[0, 0]]                          // 1x1
    ];

    const [board, setBoard] = useState(makeGrid());
    const [started, setStarted] = useState(false);
    const [active, setActive] = useState(null);
    const [greenRows, setGreenRows] = useState(0);

    const resetGame = () => {
        setBoard(makeGrid());
        setStarted(false);
        setActive(null);
        setGreenRows(0);
    };

    const randomShape = () =>
        shapes[Math.floor(Math.random() * shapes.length)];

    const spawnPiece = () => {
        const shape = randomShape();
        setActive({
            cells: shape,
            row: 0,
            col: 0
        });
    };

    const startGame = () => {
        if (!started) {
            setStarted(true);
            spawnPiece();
        }
    };

    const canMove = (nextRow, nextCol, piece = active) => {
        if (!piece) return false;

        for (let [r, c] of piece.cells) {
            const nr = nextRow + r;
            const nc = nextCol + c;

            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) {
                return false;
            }

            if (board[nr][nc] !== "") {
                return false;
            }
        }

        return true;
    };

    const checkRows = (grid) => {
        let count = 0;
        const newGrid = grid.map(row => [...row]);

        for (let r = 0; r < ROWS; r++) {
            const full = newGrid[r].every(cell => cell !== "");
            if (full) {
                count++;
                newGrid[r] = Array(COLS).fill("green");
            }
        }

        return { grid: newGrid, count };
    };

    const lockPiece = () => {
        if (!active) return;

        let newBoard = board.map(row => [...row]);

        for (let [r, c] of active.cells) {
            const rr = active.row + r;
            const cc = active.col + c;

            if (rr < 8) {
                alert("Failed");
                resetGame();
                return;
            }

            newBoard[rr][cc] = "red";
        }

        const result = checkRows(newBoard);
        newBoard = result.grid;

        const totalGreen = greenRows + result.count;

        setBoard(newBoard);
        setGreenRows(totalGreen);
        setActive(null);

        if (totalGreen >= 5) {
            setTimeout(() => {
                alert("Congrats!");
                resetGame();
            }, 50);
            return;
        }

        setTimeout(() => {
            spawnPiece();
        }, 50);
    };

    const moveDown = () => {
        if (!active) return;

        if (canMove(active.row + 1, active.col)) {
            setActive(prev => ({
                ...prev,
                row: prev.row + 1
            }));
        } else {
            lockPiece();
        }
    };

    const moveLeft = () => {
        if (!active) return;

        if (canMove(active.row, active.col - 1)) {
            setActive(prev => ({
                ...prev,
                col: prev.col - 1
            }));
        }
    };

    const moveRight = () => {
        if (!active) return;

        if (canMove(active.row, active.col + 1)) {
            setActive(prev => ({
                ...prev,
                col: prev.col + 1
            }));
        }
    };

    useEffect(() => {
        if (!started) return;

        const id = setInterval(() => {
            moveDown();
        }, 1000);

        return () => clearInterval(id);
    }, [started, active, board]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!started) return;

            if (e.key === "ArrowLeft") moveLeft();
            if (e.key === "ArrowRight") moveRight();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [started, active, board]);

    const renderCell = (row, col) => {
        let color = board[row][col];

        if (active) {
            for (let [r, c] of active.cells) {
                if (row === active.row + r && col === active.col + c) {
                    color = "red";
                }
            }
        }

        if (color === "red") return "bg-red-500";
        if (color === "green") return "bg-green-500";
        return "";
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div
                onClick={startGame}
                className="grid grid-cols-10 grid-rows-12 cursor-pointer w-full"
            >
                {board.map((row, r) =>
                    row.map((_, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`h-10 border border-gray-600 ${renderCell(r, c)}`}
                        />
                    ))
                )}
            </div>

            <button
                onClick={resetGame}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
            >
                Reset
            </button>
        </div>
    );
};