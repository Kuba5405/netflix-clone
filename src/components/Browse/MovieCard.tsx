import React from 'react';
import type { Movie } from '../../services/tmdb';
import { tmdbService } from '../../services/tmdb';
import { AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  onAddToList: () => void;
  onRemove?: () => void;
  isInWatchlist: boolean;
  showRemoveButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick, 
  onAddToList, 
  onRemove,
  isInWatchlist,
  showRemoveButton = false
}) => {
  const title = movie.title || movie.name || 'Unknown';
  const posterUrl = tmdbService.getPosterUrl(movie.poster_path);

  return (
    <div className="group relative cursor-pointer transition-transform duration-200 ease-out md:hover:scale-105">
      <img
        src={posterUrl}
        alt={title}
        className="rounded-sm object-cover w-full h-auto aspect-[2/3]"
        loading="lazy"
      />
      
      {/* Remove button (top right) */}
      {showRemoveButton && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 bg-black bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 transition opacity-0 group-hover:opacity-100 z-10"
          title="Remove"
        >
          <AiOutlineClose className="text-white text-sm" />
        </button>
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-200 rounded-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-4">
        <p className="text-white text-xs md:text-sm font-semibold text-center mb-4">
          {title}
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="bg-white hover:bg-gray-200 text-black rounded-full p-2 transition"
            title="Play"
          >
            <FaPlay className="text-sm" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToList();
            }}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 transition border-2 border-gray-600"
            title={isInWatchlist ? "Remove from My List" : "Add to My List"}
          >
            {isInWatchlist ? (
              <AiOutlineCheck className="text-sm" />
            ) : (
              <AiOutlinePlus className="text-sm" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
