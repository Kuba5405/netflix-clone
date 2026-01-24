import React from 'react';
import Header from '../Login/Header';
import { useNavigate } from 'react-router-dom';

const ForgotHeader: React.FC = () => {  
  const navigate = useNavigate();
  
  return (
    <header className="flex justify-between items-center px-8">
        <Header />
        <button className="text-white text-lg font-medium hover:underline" onClick={() => { navigate('/login'); }}>
            Sign In
        </button>
    </header>
  );
};

export default ForgotHeader;
