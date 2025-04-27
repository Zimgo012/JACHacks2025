import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyzeVibe } from '../services/geminiService';
import { RefreshCw, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';

const SelectPet = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { analyzeResult } = location.state || {};

  const apiUrl = import.meta.env.VITE_HOST;
  
  const [matchedPets, setMatchedPets] = useState([]);
  const [error, setError] = useState('');
  const [vibeAnalysis, setVibeAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedPet, setExpandedPet] = useState(null);

  useEffect(() => {
    if (!analyzeResult) {
      navigate('/home');
      return;
    }
  
    const uniquePets = (analyzeResult.pets || [])
      .filter((pet, index, self) => 
        index === self.findIndex((p) => p.id === pet.id)
      )
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  
    setMatchedPets(uniquePets);
    setVibeAnalysis(analyzeResult.analysis || '');
  }, [analyzeResult, navigate]);
  

  const handleNext = () => {
    if (currentIndex < matchedPets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRetry = () => {
    setError('');
    fetchMatchedPets();
  };  

  const handleCardClick = (pet) => {
    setExpandedPet(pet);
  };

  const handleCloseExpanded = () => {
    setExpandedPet(null);
  };

  const renderPetCard = (pet, index) => {
    const isCurrent = index === currentIndex;
    const isPrevious = index === currentIndex - 1;
    const isNext = index === currentIndex + 1;

    const handleCardClickInternal = () => {
      if(isCurrent){
        setExpandedPet(pet);
      } else if(isPrevious){
        handlePrevious();
      } else if(isNext){
        handleNext();
      }
    };

    return (
      <div
        key={pet.id}
        className={`absolute transition-all duration-500 ease-in-out transform ${
          isCurrent
            ? 'z-20 scale-95 opacity-100 translate-x-0'
            : isPrevious
            ? 'z-10 scale-90 opacity-50 -translate-x-full blur-sm'
            : isNext
            ? 'z-10 scale-90 opacity-50 translate-x-full blur-sm'
            : 'hidden'
        }`}
      >
        <div 
          className="bg-gradient-to-b from-[#EDE9E0] to-[#E5E0D5] rounded-2xl shadow-lg p-5 w-[280px] h-[420px] flex flex-col items-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          onClick={() => isCurrent && handleCardClick(pet)}
        >
          <h2 className="text-3xl font-bold text-[#30180D] mb-4">{pet.name}</h2>
          <div className="w-full h-48 mb-3 rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105">
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white rounded-full text-sm shadow-sm transform transition-all duration-300 hover:scale-110">{pet.age}</span>
            <span className="px-3 py-1 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white rounded-full text-sm shadow-sm transform transition-all duration-300 hover:scale-110">{pet.size}</span>
          </div>
          <div className="text-center mb-3">
            <p className="text-lg font-semibold text-[#30180D]">{pet.species}</p>
            <p className="text-base text-[#30180D]/80">{pet.breed}</p>
          </div>
          <p className="text-[#B67B68] text-center flex-grow text-sm">{pet.description}</p>
          <div className="mt-3 text-center">
            <p className="text-base font-semibold text-[#30180D]">
              Match: {pet.matchPercentage}%
            </p>
            <p className="text-xs text-[#30180D]/80">{pet.matchReason}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderExpandedView = () => {
    if (!expandedPet) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-gradient-to-b from-[#EDE9E0] to-[#E5E0D5] rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={handleCloseExpanded}
            className="absolute top-4 right-4 p-2 rounded-full bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white hover:from-[#A66B58] hover:to-[#B67B68] transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <img
                src={expandedPet.imageUrl}
                alt={expandedPet.name}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white rounded-full text-sm shadow-sm">{expandedPet.age}</span>
                <span className="px-3 py-1 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white rounded-full text-sm shadow-sm">{expandedPet.size}</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-bold text-[#30180D] mb-4">{expandedPet.name}</h2>
              <p className="text-xl font-semibold text-[#30180D] mb-2">{expandedPet.species}</p>
              <p className="text-lg text-[#30180D]/80 mb-4">{expandedPet.breed}</p>
              <p className="text-[#B67B68] mb-6">{expandedPet.description}</p>
              <div className="bg-gradient-to-r from-[#B67B68] to-[#C68B78] p-4 rounded-xl text-white">
                <p className="text-lg font-semibold mb-2">Match: {expandedPet.matchPercentage}%</p>
                <p className="text-sm">{expandedPet.matchReason}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Oops!</h1>
        <p className="text-lg text-gray-700 mb-8">{error}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white font-medium rounded-lg hover:from-[#A66B58] hover:to-[#B67B68] transition-colors shadow-md"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
          {analyzeResult && (
            <button
              onClick={handleRetry}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white font-medium rounded-lg hover:from-[#A66B58] hover:to-[#B67B68] transition-colors shadow-md"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Retry Analysis
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen m-0 p-10 bg-[#EDE9E0]'>
        <h1 className='text-8xl font-bold font-["Cal_Sans"] tracking-wider text-[#30180D] cursor-pointer text-center'>Your Pet Matches</h1>
        <div className='h-20'></div>
        <div className="relative flex justify-center items-center h-[450px] overflow-hidden">
          {matchedPets.map((pet, index) => renderPetCard(pet, index))}
        </div>

        {matchedPets.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <p className="text-lg text-[#30180D] mb-6">
              We couldn't find any matching pets based on your description. Please try again with different preferences.
            </p>
            <button
              onClick={() => window.history.back()}
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white font-medium rounded-lg hover:from-[#A66B58] hover:to-[#B67B68] transition-colors shadow-md"
            >
              Go Back
            </button>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white font-medium rounded-lg hover:from-[#A66B58] hover:to-[#B67B68] transition-colors shadow-md mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      {renderExpandedView()}
    </div>
  );
};
export default SelectPet; 