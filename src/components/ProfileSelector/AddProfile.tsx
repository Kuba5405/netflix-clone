import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

interface AddProfileProps {
  onClick?: () => void;
}

const AddProfile: React.FC<AddProfileProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="w-32 h-32 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-gray-800 hover:bg-gray-700 hover:border-gray-400 transition">
        <AiOutlinePlus className="text-gray-400 group-hover:text-white transition" size={48} />
      </div>
      <p className="text-gray-400 group-hover:text-white text-center mt-3 transition">
        Add Profile
      </p>
    </div>
  );
};

export default AddProfile;
