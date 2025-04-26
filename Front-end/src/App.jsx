import { useState, useEffect } from 'react'
import {Routes, Route, Link} from 'react-router-dom';


const images = import.meta.glob('./assets/pets/*.png', {eager: true});
const imageList = Object.values(images).map((mod) => mod.default);

function App() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % imageList.length);
        setFade(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className='min-h-screen m-0 p-10 bg-[#EDE9E0]'>
      <nav className='flex justify-between items-end'>
        <div className='flex items-end'>
          <img src='/icon.svg' alt='PETO VIBE icon' className='w-15 h-15 flex' />
          <div className='w-5'></div>
          <span className='text-6xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D]'>Peto</span>
          <span className='text-6xl font-bold font-["Cal_Sans"] tracking-wider text-[#B67B68]'>Vibe</span>
        </div>
        <div className='flex'>
          <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D]'>Sign</span>
          <div className='w-1'></div>
          <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#B67B68]'>In</span>
          <div className='w-10'></div>
          <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D]'>Sign</span>
          <div className='w-1'></div>
          <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#B67B68]'>Out</span>
        </div>
      </nav>
      <main className='mt-10 flex justify-center'>
        <img 
        src={imageList[index]} 
        alt='changing pet' 
        className={`h-[1000px] mt-[-150px] object-cover rounded-lg transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
        />
        <div className='w-200'>
          <div>
          <div className='h-20'></div>
          <p className='text-8xl font-["Cal_Sans"] tracking-wider text-[#B67B68]'>Your vibe finds a soul.</p>
          <div className='h-10'></div>
          <span className='text-9xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D]'>Rescue </span>
          <span className='text-8xl font-["Cal_Sans"] tracking-wider text-[#B67B68]'>your match.</span>
          </div>
          <input></input>
        </div>
      </main>
    </div>
  );
}

export default App
