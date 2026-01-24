import React from 'react';

interface ManageButtonProps {
  onClick?: () => void;
}

const ManageButton: React.FC<ManageButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-8 py-3 text-gray-400 text-xl border-2 border-gray-600 hover:border-white hover:text-white transition-all duration-200 tracking-widest"
    >
      MANAGE PROFILES
    </button>
  );
};

export default ManageButton;
