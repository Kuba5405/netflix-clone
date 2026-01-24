import React, { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface VideoPlayerProps {
  imdbId: string;
  tmdbId: string;
  type: 'movie' | 'tv';
  title: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  imdbId, 
  tmdbId, 
  type, 
  title, 
  onClose
}) => {
  const mediaId = imdbId || tmdbId;
  const embedUrl = type === 'movie'
    ? `https://hnembed.cc/embed/movie/${mediaId}`
    : `https://hnembed.cc/embed/tv/${mediaId}`;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-8 py-4 bg-black bg-opacity-80">
        <h2 className="text-white text-xl md:text-2xl font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="bg-black bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition"
        >
          <AiOutlineClose className="text-white text-2xl" />
        </button>
      </div>

      <div className="flex-1 w-full">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
