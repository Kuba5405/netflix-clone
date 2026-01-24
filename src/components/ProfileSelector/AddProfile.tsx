import React from 'react';

interface AddProfileProps {
  onClick?: () => void;
}

const AddProfile: React.FC<AddProfileProps> = ({ onClick }) => {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-40 h-40 bg-transparent border-4 border-gray-600 rounded-md flex items-center justify-center group-hover:border-white transition-all duration-200">
        <svg
          className="w-16 h-16 text-gray-600 group-hover:text-white transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-gray-400 text-xl mt-4 group-hover:text-white transition-colors">
        Add Profile
      </p>
    </div>
  );
};

export default AddProfile;
