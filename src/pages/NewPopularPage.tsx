import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Browse/Navbar";
import MovieRow from "../components/Browse/MovieRow";
import VideoPlayer from "../components/Browse/VideoPlayer";
import { tmdbService, type Movie } from '../services/tmdb';
import { watchlistService } from '../services/watchlist';
import { watchHistoryService } from '../services/watchHistory';
import { useProfile } from '../contexts/ProfileContext';

function NewPopularPage() {
  const { currentProfile, profiles } = useProfile();
  const navigate = useNavigate();

  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
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

    fetchContent();
    if (currentProfile) {
      fetchWatchlist();
    }
  }, [currentProfile, profiles]);

  const fetchContent = async () => {
    try {
      const [upcomingData, nowPlayingData, trendingData, popularTVData] = await Promise.all([
        tmdbService.getUpcoming(),
        tmdbService.getNowPlaying(),
        tmdbService.getTrending(),
        tmdbService.getPopularTVShows(),
      ]);

      setUpcomingMovies(upcomingData);
      setNowPlayingMovies(nowPlayingData);
      setTrendingMovies(trendingData);
      setPopularTVShows(popularTVData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (!currentProfile) return;

    try {
      const watchlist = await watchlistService.getWatchlist(currentProfile.id);
      const ids = watchlist.map((item: any) => parseInt(item.movies.tmdb_id));
      setWatchlistMovieIds(ids);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const handleAddToList = async (movie: Movie) => {
    if (!currentProfile) return;

    try {
      const isInList = watchlistMovieIds.includes(movie.id);

      if (isInList) {
        await watchlistService.removeFromWatchlist(currentProfile.id, movie.id);
        setWatchlistMovieIds(prev => prev.filter(id => id !== movie.id));
      } else {
        await watchlistService.addToWatchlist(currentProfile.id, movie);
        setWatchlistMovieIds(prev => [...prev, movie.id]);
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
        <p className="text-white text-xl">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black pb-20">
      <Navbar />
      
      <div className="pt-24 z-30">
        <h1 className="text-white text-4xl font-bold px-4 md:px-12 mb-8">New & Popular</h1>

        <MovieRow
          title="Trending Now"
          movies={trendingMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Upcoming Movies"
          movies={upcomingMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Now Playing in Theaters"
          movies={nowPlayingMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Popular TV Shows"
          movies={popularTVShows}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />
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

export default NewPopularPage;
