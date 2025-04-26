import { useState, useEffect, useRef } from 'react'
import {useNavigate} from 'react-router-dom';


const images = import.meta.glob('../assets/*.png', {eager: true});
const imageList = Object.values(images).map((mod) => mod.default);


function Home() {  
  const apiUrl = import.meta.env.VITE_HOST;

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const vibeInputRef = useRef(null);
  const [vibeText, setVibeText] = useState('');
  const navigate = useNavigate();

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

  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();

      if(vibeText.trim().length === 0) return;

      fetch(apiUrl+'vibesearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({vibe: vibeText.trim()}),
      }).catch(error => {
        console.log('Fail to send data:',error);
      });

      navigate('/select-pet');
    }
  }
    
    return (
      <div className='min-h-screen m-0 p-10 bg-[#EDE9E0]'>
        <nav className='flex justify-between items-end'>
          <div className='flex items-end z-1'>
            <img src='/icon.svg' alt='PETO VIBE icon' className='w-15 h-15 flex' />
            <div className='w-5'></div>
            <span className='text-6xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D]'>Peto</span>
            <span className='text-6xl font-bold font-["Cal_Sans"] tracking-wider text-[#B67B68]'>Vibe</span>
          </div>
          <div className='flex'>
            <div className='cursor-pointer flex'>
              <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D]'>Sign</span>
              <div className='w-1'></div>
              <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#B67B68]'>In</span>
            </div>
            <div className='w-10'></div>
            <div className='cursor-pointer flex'>
              <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D]'>Sign</span>
              <div className='w-1'></div>
              <span className='text-2xl font-bold font-["Cal_Sans"] tracking-wider text-[#B67B68]'>Out</span>
            </div>
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
              <span 
              className='text-9xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D] cursor-pointer'
              onClick={() => vibeInputRef.current.focus()}
              >Rescue </span>
              <span className='text-8xl font-["Cal_Sans"] tracking-wider text-[#B67B68]'>your match.</span>
            </div>
            <div>
              <textarea
              ref={vibeInputRef}
              value={vibeText}
              onChange={(e) => {
                setVibeText(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              rows='3'
              placeholder='Describe your vibe...' 
              className="mt-6 p-4 w-full rounded-lg border-4 border-[#B67B68] text-2xl font-['Cal_Sans'] transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-[#A65A48] focus:border-[#A65A48] focus:scale-105 resize-none overflow-hidden"
              ></textarea>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  export default Home
  