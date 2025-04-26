import { useState, useEffect, useRef } from 'react'
import {Routes, Route, Link, useNavigate} from 'react-router-dom';


function SelectPet() {  
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
    if(e.key == 'Enter'){
      e.preventDefault();

      fetch(apiUrl+'vibesearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({vibe: vibeText}),
      }).catch(error => {
        console.log('Fail to send data:',error);
      });

      navigate('/select-pet');
    }
  }
  
  return (
    <div className='min-h-screen m-0 p-10 bg-[#EDE9E0]'>
      Hello
    </div>
  );
}

export default SelectPet
