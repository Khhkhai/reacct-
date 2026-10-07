import { useState } from "react";

export const Slido = () => {
    const [ useSolved, setUseSolved ] = useState(0)
    const [ useReset, setUseReset ] = useState(true)


    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let srcArray = ["../../assets/1.png", "../../assets/2.png", "../../assets/3.png", 
                    "../../assets/4.png", "../../assets/5.png", "../../assets/6.png", 
                    "../../assets/7.png", "../../assets/8.png", ''];
    let shuffledArray = [...srcArray]
    const [ grid, setGrid ] = useState(shuffle(shuffledArray))
    
    const moveableElement = [
        [1, 3], [0, 2, 4], [1, 5],
        [0, 4, 6], [1, 3, 5, 7], [2, 4, 8],
        [3, 7], [4, 6, 8], [5, 7]
    ]
    const getEmptySlide = () => {
        for (let i in grid) {
            if (grid[i] === '') {
                return i
            }
        }
    }

    const getMoveableSlides = (src, index) => {
        const emptySlide = Number(getEmptySlide())
        if (index === emptySlide) {
            return null
        }
        setUseReset(false)

        const tmpGrid = [...grid]
        if (moveableElement[index].includes(emptySlide)) {
            tmpGrid[emptySlide] = src
            tmpGrid[index] = ''
            setGrid(tmpGrid)
        }
        if (useSolved === 1) {
            setUseSolved(useSolved + 1)
            return
        } 

        if (checkSlide(tmpGrid)) {
            setTimeout(() => {
                alert("Correct!")
                setGrid(shuffle(shuffledArray))
                setUseSolved(0)
                const currentScore = parseInt(localStorage.getItem('score'), 10)
                localStorage.setItem('score', String(currentScore + 1))
            }, 200);
        }
    }

    const getSlideByKey = (event) => {
        const emptySlide = Number(getEmptySlide())
        switch (event.key) {
            case 'ArrowRight':
                if ([0, 3, 6].includes(emptySlide)) {
                    return null
                } else {
                    return emptySlide - 1
                }     
            case 'ArrowLeft':
                if ([2, 5, 8].includes(emptySlide)) {
                    return null
                } else {
                    return emptySlide + 1
                } 
            case 'ArrowUp':
                if ([6, 7, 8].includes(emptySlide)) {
                    return null
                } else {
                    return emptySlide + 3
                }
            case 'ArrowDown':
                if ([0, 1, 2].includes(emptySlide)) {
                    return null
                } else {
                    return emptySlide - 3
                }
            default:
                break;
        }
    }

    const handleKeyDown = (event) => {
        const cell = getSlideByKey(event)
        if (cell != null) {
            const src = grid[cell]
            getMoveableSlides(src, cell)
        }
    }

    const checkSlide = (tmpGrid) => {
        return tmpGrid.every((src, i) => src === srcArray[i])
    }
    
    const handleSolve = () => {
        setUseSolved(useSolved + 1)
        setGrid(srcArray)
        setUseReset(false)
    }

    const handleReset = () => {
        setUseReset(true)
        setGrid(shuffle(shuffledArray))
        setUseSolved(0)
    }

    return (
        <>
        <div className="w-full flex flex-col items-center justify-center">
            <div className="grid grid-cols-3 m-auto" tabIndex={0} onKeyDown={(e) => handleKeyDown(e)}>
                {grid.map((row, row_index) => 
                    row === '' ? 
                    <div key='empty' className="w-[150px] h-[150px] border-[#333] border-1">
                    </div>
                    :
                    <div key={row} className="w-[150px] h-[150px] border-[#333] border-1" onClick={() => getMoveableSlides(row, row_index)}>
                        <img src={row} />
                    </div> 
                )}
            </div>
            <div className="text-center m-3">
                <button className="btn m-2" onClick={handleSolve} disabled={useSolved !== 0}>Solve</button>
                <button className="btn btn-primary m-2" onClick={handleReset} disabled={useReset}>Reset</button>
            </div>
        </div>
        </>
    )
}