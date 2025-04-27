import React from 'react';

// Add this to your existing styles or create a new style block
const styles = `
  @keyframes spin-reverse {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  
  .animate-spin-reverse {
    animation: spin-reverse 3s linear infinite;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-16">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 border-8 border-t-[#B67B68] border-r-[#C68B78] border-b-[#B67B68] border-l-[#C68B78] rounded-full animate-spin"></div>
          
          {/* Inner rotating circle (opposite direction) */}
          <div className="absolute inset-8 border-8 border-t-[#C68B78] border-r-[#B67B68] border-b-[#C68B78] border-l-[#B67B68] rounded-full animate-spin-reverse"></div>
          
          {/* Center pet icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-[#B67B68] to-[#C68B78] rounded-full flex items-center justify-center shadow-lg">
              <svg 
                className="w-16 h-16 text-white animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-4 mt-12">
          <span className="w-4 h-4 bg-[#B67B68] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-4 h-4 bg-[#B67B68] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-4 h-4 bg-[#B67B68] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>

        {/* Loading text */}
        <p className="mt-8 text-3xl font-semibold text-[#30180D]">
          Finding your perfect pet match
        </p>
      </div>
    </div>
  );
};

export default Loading; 