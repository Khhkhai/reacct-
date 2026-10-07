import { useEffect, useState } from "react"

export const Guess = () => {
    const [remainingAttempts, setRemainingAttempts] = useState(5)
    const [value, setValue ] = useState('')
    const randomNumber = Math.floor(Math.random() * 20) + 1;

    const [number, setNumber] = useState(randomNumber)
    const [ reply, setReply ] = useState('')
    const startNewGame = () => {
        setRemainingAttempts(5)
        setNumber(randomNumber)
        setValue('')
        setReply('')
    }

    const hanldeSubmit = () => {
        setValue(parseInt(value, 10))
        setReply('')
        if (remainingAttempts < 1) {
            alert(`Failed! The answer was ${randomNumber}`)
            startNewGame()
            return
        }
        console.log(number)
        console.log(value)

        setRemainingAttempts(remainingAttempts - 1)
        setValue('')

        if (value < number) {
            setReply("Too low")
        } else if (value > number) {
            setReply("Too high")
        } else {
            const currentScore = parseInt(localStorage.getItem('score'), 10)
            localStorage.setItem('score', String(currentScore + 1))
            alert("Correct!")
            startNewGame()
        }
    }

    return (
       <div className="w-full flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Instruction</h1>
            <p className="text-gray-600 mt-2">Your content here.</p>
            <input className="input" value={value} onChange={(e) => setValue(e.target.value)}></input>
            {reply}
            <div className="flex gap-3">
                <button className="btn btn-primary" onClick={hanldeSubmit}>Submit</button>
                <button className="btn btn-primary" onClick={startNewGame}>Reset</button>
            </div>
            <p>Remaining Attempts: {remainingAttempts} </p>
            
        </div>
    )
}