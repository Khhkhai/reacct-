import { useEffect, useState } from 'react'
import axios from 'axios'

function Home() {
    const [score, setScore] = useState(null)
    const handleRest = () => {
        localStorage.clear()
        getScoreAPI()
    }

    const getScoreAPI = async() => {
        try {
            const response = await axios.get(`https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json`, {});
            const score = response.data.score;
            setScore(score)
            localStorage.setItem('score', String(score))

        } catch (error: unknown) {
            alert(error)
        }
    }

    useEffect(() => {
        const savedScore = localStorage.getItem('score');
        if (savedScore === null) {
            getScoreAPI()
        } else {
            setScore(Number(savedScore))
        }
    })

  return (
    <div className="flex self-center h-full w-full">
        <div className='m-auto'>
            <span className="text-red-600 text-[2em]">Please choose an option from the navbar.</span>
            <div className='text-center'>
                Games won: {score} 
                <button className='hover:underline' onClick={handleRest}>(reset)</button>
            </div>
        </div>
     </div>
  )
}
export default Home
