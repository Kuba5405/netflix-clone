import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Browse/Navbar";
import VideoPlayer from "../components/Browse/VideoPlayer";
import { tmdbService, type Movie } from '../services/tmdb';
import { watchlistService } from '../services/watchlist';
import { watchHistoryService } from '../services/watchHistory';
import { useProfile } from '../contexts/ProfileContext';
import MovieCard from '../components/Browse/MovieCard';

function MyListPage() {
  const { currentProfile, profiles } = useProfile();
  const navigate = useNavigate();

  const [myListMovies, setMyListMovies] = useState<Movie[]>([]);
  const [watchlistMovieIds, setWatchlistMovieIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    if (!currentProfile && profiles.length > 0) {
      navigate('/');
      return;
    }

    if (currentProfile) {
      fetchWatchlist();
    }
  }, [currentProfile, profiles]);

  const fetchWatchlist = async () => {
  if (!currentProfile) return;

  try {
    const watchlist = await watchlistService.getWatchlist(currentProfile.id);
    const movies = watchlist.map((item: any) => ({
      id: parseInt(item.movies.tmdb_id),
      title: item.movies.title,
      name: item.movies.title,
      overview: item.movies.description,
      poster_path: item.movies.poster_url,
      backdrop_path: item.movies.backdrop_url,
      vote_average: parseFloat(item.movies.rating || '0'),
      release_date: item.movies.release_year?.toString(),
      media_type: (item.movies.type === 'tv' ? 'tv' : 'movie') as 'tv' | 'movie', // Fix type
    }));

    setMyListMovies(movies);
    setWatchlistMovieIds(movies.map((m: Movie) => m.id));
    setLoading(false);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    setLoading(false);
  }
};


  const handleAddToList = async (movie: Movie) => {
    if (!currentProfile) return;

    try {
      const isInList = watchlistMovieIds.includes(movie.id);

      if (isInList) {
        await watchlistService.removeFromWatchlist(currentProfile.id, movie.id);
        setWatchlistMovieIds(prev => prev.filter(id => id !== movie.id));
        setMyListMovies(prev => prev.filter(m => m.id !== movie.id));
      } else {
        await watchlistService.addToWatchlist(currentProfile.id, movie);
        setWatchlistMovieIds(prev => [...prev, movie.id]);
        setMyListMovies(prev => [movie, ...prev]);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
    
    if (currentProfile) {
      watchHistoryService.addToContinueWatching(currentProfile.id, movie);
    }
    
    try {
      const details = await tmdbService.getDetails(movie.id, type);
      setMovieDetails(details);
      setShowPlayer(true);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setMovieDetails({ external_ids: { imdb_id: null } });
      setShowPlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  if (!currentProfile) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-white text-xl">Loading your list...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12">
        <h1 className="text-white text-4xl font-bold mb-8">My List</h1>

        {myListMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-xl mb-4">Your list is empty</p>
            <p className="text-gray-500 text-sm">Add movies and shows to your list to watch them later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {myListMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleMovieClick(movie)}
                onAddToList={() => handleAddToList(movie)}
                isInWatchlist={watchlistMovieIds.includes(movie.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showPlayer && selectedMovie && movieDetails && (
        <VideoPlayer
          imdbId={movieDetails.external_ids?.imdb_id}
          tmdbId={selectedMovie.id.toString()}
          type={selectedMovie.media_type || (selectedMovie.title ? 'movie' : 'tv')}
          title={selectedMovie.title || selectedMovie.name || 'Unknown'}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}

export default MyListPage;
