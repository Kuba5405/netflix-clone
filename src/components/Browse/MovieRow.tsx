import React, { useRef, useState } from 'react';
import type { Movie } from '../../services/tmdb';
import MovieCard from './MovieCard';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onAddToList: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
  watchlistMovieIds: number[];
  showRemoveButton?: boolean;
}

const MovieRow: React.FC<MovieRowProps> = ({ 
  title, 
  movies, 
  onMovieClick, 
  onAddToList, 
  onRemove,
  watchlistMovieIds,
  showRemoveButton = false
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.offsetWidth - 100;
      const newScrollLeft = direction === 'left' 
        ? rowRef.current.scrollLeft - scrollAmount
        : rowRef.current.scrollLeft + scrollAmount;

      rowRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 md:px-12 mt-4 space-y-4">
      <h2 className="text-white text-md md:text-xl lg:text-2xl font-semibold">
        {title}
      </h2>

      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black bg-opacity-50 hover:bg-opacity-75 transition flex items-center justify-center"
          >
            <BsChevronLeft className="text-white text-3xl" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-scroll overflow-y-hidden scrollbar-hide scroll-smooth"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-[120px] sm:min-w-[150px] md:min-w-[180px] lg:min-w-60 shrink-0">
              <MovieCard 
                movie={movie} 
                onClick={() => onMovieClick(movie)}
                onAddToList={() => onAddToList(movie)}
                onRemove={onRemove ? () => onRemove(movie) : undefined}
                isInWatchlist={watchlistMovieIds.includes(movie.id)}
                showRemoveButton={showRemoveButton}
              />
            </div>
          ))}
        </div>

        {isHovering && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black bg-opacity-50 hover:bg-opacity-75 transition flex items-center justify-center"
          >
            <BsChevronRight className="text-white text-3xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
