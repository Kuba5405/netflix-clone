import React from 'react';

interface ManageButtonProps {
  onClick?: () => void;
}

const ManageButton: React.FC<ManageButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-8 px-6 py-2 border-2 border-gray-600 text-gray-400 hover:text-white hover:border-white transition text-lg font-medium"
    >
      MANAGE PROFILES
    </button>
  );
};

export default ManageButton;
