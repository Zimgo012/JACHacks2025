import { useState, useEffect, useRef } from 'react'
import {useNavigate} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import {analyzeVibe} from '../services/geminiService';
import Loading from '../pages/Loading';


const images = import.meta.glob('../assets/*.png', {eager: true});
const imageList = Object.values(images).map((mod) => mod.default);


function InHome() {  
  const apiUrl = import.meta.env.VITE_HOST;

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const vibeInputRef = useRef(null);
  const [vibeText, setVibeText] = useState('');
  const navigate = useNavigate();
  const {logout, user, isAuthenticated, getAccessTokenSilently} = useAuth0();
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    async function saveUserToBackend() {
      try {
        const token = await getAccessTokenSilently();

        console.log('Saving user to backend...');
        console.log('User:', user);
        console.log('apiUrl:', apiUrl);

        const response = await fetch('http://localhost:5176/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
          }),
        });

        if (!response.ok) {
          console.warn('Failed to save user:', await response.text());
        } else {
          console.log('✅ User saved successfully.');
        }
      } catch (error) {
        console.error('Error saving user to backend:', error.message);
      }
    }

    if (isAuthenticated && user) {
      saveUserToBackend();
    }
  }, [isAuthenticated, user, apiUrl, getAccessTokenSilently]);

  const handleKeyDown = async (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();

      if(vibeText.trim().length === 0) return;

      console.log('vibeText:',vibeText);

      try{
        setIsLoading(true);

        const result = await analyzeVibe(vibeText.trim());
        
        console.log('Gemini analyzing result:', result);

        navigate('/select-pet', {state: {analyzeResult: result}});

        setIsLoading(false);        
        
      }catch(error){
        console.log('error analyzing vibe:',error);
      }
    }
  };

  if(isLoading){
    return <Loading />;
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
            <div className='flex items-center'>
            <div className='cursor-pointer flex'>
                {isAuthenticated && user && (
                    <img 
                    src={user.picture}
                    alt='user'
                    className='w-12 h-12 rounded-full object-cover cursor-pointer'
                    onMouseEnter={() => setShowProfile(prev => true)}
                    onMouseLeave={() => setShowProfile(prev => false)}
                    />
                )}
                {isAuthenticated && user && showProfile && (
                    <div className='absolute top-28 right-25 bg-white p-4 rounded-lg shadow-lg text-center z-10'>
                        <p className='text-lg font-semibold'>{user.name}</p>
                        <p className='text-lg font-semibold'>{user.email}</p>
                    </div>
                )}
            </div>
            <div className='w-10'></div>
            <div className='cursor-pointer flex'  onClick={() => logout({returnTo: window.location.origin})}>
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
                <p className='text-8xl font-["Cal_Sans"] tracking-wider text-[#B67B68]'>Your vibe finds</p>
                <p className='text-8xl font-["Cal_Sans"] tracking-wider text-[#B67B68]'>a soul.</p>
                <div className='h-10'></div>
                <p 
                className='text-9xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D] cursor-pointer'
                onClick={() => vibeInputRef.current.focus()}
                >Rescue </p>
                <p className='text-8xl font-["Cal_Sans"] tracking-wider text-[#B67B68]'>your match.</p>
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
  
export default InHome
  