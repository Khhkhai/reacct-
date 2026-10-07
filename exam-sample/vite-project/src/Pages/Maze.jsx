import { useEffect, useState } from "react";

export const Maze = ({ setWins }) => {
    const mazes = [
        [
            [2,0,1,0,0,0,0,0],
            [1,0,1,0,1,1,1,0],
            [0,0,0,0,0,0,1,0],
            [0,1,1,1,1,0,1,0],
            [0,0,0,0,1,0,0,0],
            [1,1,1,0,1,1,1,0],
            [0,0,0,0,0,0,0,3],
            [1,1,1,1,1,1,0,1]
        ],
        [
            [2,0,0,1,0,0,0,0],
            [1,1,0,1,0,1,1,0],
            [0,0,0,0,0,0,1,0],
            [0,1,1,1,1,0,1,0],
            [0,0,0,0,1,0,0,0],
            [1,1,1,0,1,1,1,0],
            [0,0,0,0,0,0,0,3],
            [1,1,1,1,1,1,0,1]
        ]
    ];

    const [board, setBoard] = useState([]);
    const [player, setPlayer] = useState({ row: 0, col: 0 });
    const [active, setActive] = useState(false);

    const loadMaze = (different = false) => {
        setBoard(prev => {
            let maze;

            do {
                maze = mazes[Math.floor(Math.random() * mazes.length)];
            } while (different && maze === prev);

            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (maze[r][c] === 2) {
                        setPlayer({ row: r, col: c });
                    }
                }
            }

            return maze;
        });

        setActive(false);
    };

    useEffect(() => {
        loadMaze();
    }, []);

    const move = (dr, dc) => {
        const nr = player.row + dr;
        const nc = player.col + dc;

        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) return;
        if (board[nr][nc] === 1) return;

        setPlayer({ row: nr, col: nc });

        if (board[nr][nc] === 3) {
            alert("Congrats!");
            setWins(prev => prev + 1);
            loadMaze();
        }
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (!active) return;

            if (e.key === "ArrowUp") move(-1, 0);
            if (e.key === "ArrowDown") move(1, 0);
            if (e.key === "ArrowLeft") move(0, -1);
            if (e.key === "ArrowRight") move(0, 1);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [active, player, board]);

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div
                onClick={() => setActive(true)}
                className="grid grid-cols-8"
            >
                {board.map((row, r) =>
                    row.map((cell, c) => {
                        let bg = "bg-white";

                        if (cell === 1) bg = "bg-black";
                        if (cell === 3) bg = "bg-green-500";
                        if (player.row === r && player.col === c) bg = "bg-blue-500";

                        return (
                            <div
                                key={`${r}-${c}`}
                                className={`w-10 h-10 border ${bg}`}
                            />
                        );
                    })
                )}
            </div>

            <button
                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
                onClick={() => loadMaze(true)}
            >
                Reset
            </button>
        </div>
    );
};