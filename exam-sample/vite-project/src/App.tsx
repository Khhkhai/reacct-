import reactLogo from './assets/react.svg'
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import { Blanko } from './Pages/Blanko'
import { Slido } from './Pages/Slido'
import { Tetro } from './Pages/Tetro'
import { Guess } from './Pages/Guess'
import { Matcho } from './Pages/Matcho'
import { Maze } from './Pages/Maze'




function App() {

  return (
    <div className='flex flex-col min-h-screen'>
        <header className='fixed top-0 left-0 h-20 w-full bg-[#eeeeee] flex justify-between'>
            <img src={reactLogo} className='m-3.75 w-12.5 h-12.5' alt="React logo" />
            <div className='flex items-center gap-3 p-3'>
                <Link to="/">
                    <span className="max-[800px]:inline min-[801px]:hidden">H</span>
                    <span className="max-[800px]:hidden min-[801px]:inline">Home</span>
                </Link> 
                <span>|</span>
                <Link to='/blanko'>
                    <span className="max-[800px]:inline min-[801px]:hidden">B</span>
                    <span className="max-[800px]:hidden min-[801px]:inline">Blanko</span>
                </Link> 
                <span>|</span>
                <Link to='/slido'>
                    <span className="max-[800px]:inline min-[801px]:hidden">S</span>
                    <span className="max-[800px]:hidden min-[801px]:inline">Slido</span>
                </Link> 
                <span>|</span>
                <Link to='/tetro'>
                    <span className="max-[800px]:inline min-[801px]:hidden">T</span>
                    <span className="max-[800px]:hidden min-[801px]:inline">Tetro</span>
                </Link> 
                <span>|</span>
                <Link to='/guess'>
                    <span className="max-[800px]:inline min-[801px]:hidden">G</span>
                    <span className="max-[800px]:hidden min-[801px]:inline">Guess</span>
                </Link> 
                <span>|</span>
                <Link to='/matcho'>
                    <span className="max-[800px]:inline min-[801px]:hidden">M</span>
                    <span className="max-[800px]:hidden min-[801px]:inline">Matcho</span>
                </Link> 
                <span>|</span>
                <Link to='/maze'>
                    <span className="max-[800px]:inline min-[801px]:hidden">M</span>
                    <span className="max-[800px]:hidden min-[801px]:inline">Maze</span>
                </Link> 
            </div>
        </header> 
        <main className="pt-20 grow flex">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blanko" element={<Blanko />} />
                <Route path="/slido" element={<Slido />} />
                <Route path="/tetro" element={<Tetro />} />
                <Route path="/guess" element={<Guess />} />
                <Route path="/matcho" element={<Matcho />} />
                <Route path="/maze" element={<Maze />} />



            </Routes>
        </main>
        <footer className='h-[50px] w-full bg-[#999999]'>
        </footer>
    </div>
  )
}
export default App
