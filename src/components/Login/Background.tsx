import React from 'react';
import bgImage from '../../assets/background.jpg';

const Background: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover" /> 
        <div className="absolute inset-0 bg-black/60 md:bg-black/40" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black to-transparent" />
    </>
  );
};

export default Background;
