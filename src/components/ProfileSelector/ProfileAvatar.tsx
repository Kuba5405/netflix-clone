import React from 'react';

interface ProfileAvatarProps {
  color: string;
  name?: string;
  onClick?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ color, name, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`w-40 h-40 ${color} rounded-md flex items-center justify-center 
          border-4 border-transparent group-hover:border-white transition-all duration-200`}
      >
        <svg
          className="w-24 h-24 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="7" cy="9" r="1.5" />
          <circle cx="17" cy="9" r="1.5" />
          <path d="M6.5 14.5c0-.5.5-1 1-1h9c.5 0 1 .5 1 1s-.5 1-1 1h-9c-.5 0-1-.5-1-1z" />
        </svg>
      </div>

      {name && (
        <p className="text-gray-400 text-xl mt-4 group-hover:text-white transition-colors">
          {name}
        </p>
      )}
    </div>
  );
};

export default ProfileAvatar;
