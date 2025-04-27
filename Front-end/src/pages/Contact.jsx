import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// 스타일 추가
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const { pet } = location.state || {};
  const { user } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, phone, message }),
      // });

      navigate('/home');
    } catch (error) {
      console.error('Failed to submit form', error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
    if (pet) {
      setMessage(`Hello, I am very interested in adopting ${pet.name}, a ${pet.age.toLowerCase()} ${pet.size.toLowerCase()} ${pet.breed} (${pet.species}). ${pet.description} Please let me know how I can proceed with the adoption.`);
    }
  }, [user, pet]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EDE9E0] p-6 animate-fadeIn">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-[#30180D] text-center font-['Cal_Sans']">Contact Us</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white text-lg font-bold rounded-lg shadow-md hover:from-[#A65A48] hover:to-[#B67B68] transition-all"
          >
            Go Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-lg font-semibold text-[#B67B68] mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 rounded-lg border-2 border-[#B67B68] text-lg focus:outline-none focus:ring-2 focus:ring-[#A65A48]"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-lg font-semibold text-[#B67B68] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border-2 border-[#B67B68] text-lg focus:outline-none focus:ring-2 focus:ring-[#A65A48]"
              required
            />
          </div>
          {/* Phone */}
          <div>
            <label className="block text-lg font-semibold text-[#B67B68] mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-3 rounded-lg border-2 border-[#B67B68] text-lg focus:outline-none focus:ring-2 focus:ring-[#A65A48]"
              required
            />
          </div>
          {/* Message */}
          <div>
            <label className="block text-lg font-semibold text-[#B67B68] mb-2">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="How can we help you?"
              rows={4}
              className="w-full p-3 rounded-lg border-2 border-[#B67B68] text-lg focus:outline-none focus:ring-2 focus:ring-[#A65A48] resize-none"
              required
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#B67B68] to-[#C68B78] text-white text-xl font-bold rounded-lg shadow-md hover:from-[#A65A48] hover:to-[#B67B68] transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
