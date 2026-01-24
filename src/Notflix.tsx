import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Banner from "./components/Browse/Banner";
import Navbar from "./components/Browse/Navbar";
import MovieRow from "./components/Browse/MovieRow";
import VideoPlayer from "./components/Browse/VideoPlayer";
import { tmdbService, type Movie } from './services/tmdb';
import { watchlistService } from './services/watchlist';
import { watchHistoryService } from './services/watchHistory';
import { useAuth } from './contexts/AuthContext';
import { useProfile } from './contexts/ProfileContext';

function Notflix() {
  const { profileId } = useParams();
  const { user } = useAuth();
  const { currentProfile, profiles } = useProfile();
  const navigate = useNavigate();

  const [trending, setTrending] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [netflixOriginals, setNetflixOriginals] = useState<Movie[]>([]);
  const [myListMovies, setMyListMovies] = useState<Movie[]>([]);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<Movie[]>([]);
  const [watchlistMovieIds, setWatchlistMovieIds] = useState<number[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    // If no current profile but we have profiles, redirect to selector
    if (!currentProfile && profiles.length > 0) {
      navigate('/');
      return;
    }

    fetchMovies();
    if (currentProfile) {
      fetchWatchlist();
      fetchContinueWatching();
    }
  }, [profileId, currentProfile, profiles]);

  const fetchMovies = async () => {
    try {
      const [
        trendingData,
        popularMoviesData,
        popularTVData,
        topRatedData,
        netflixData,
      ] = await Promise.all([
        tmdbService.getTrending(),
        tmdbService.getPopularMovies(),
        tmdbService.getPopularTVShows(),
        tmdbService.getTopRated(),
        tmdbService.getNetflixOriginals(),
      ]);

      setTrending(trendingData);
      setPopularMovies(popularMoviesData);
      setPopularTVShows(popularTVData);
      setTopRated(topRatedData);
      setNetflixOriginals(netflixData);

      const allMovies = [...trendingData, ...popularMoviesData];
      const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];
      setFeaturedMovie(randomMovie);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (!currentProfile) return;

    try {
      const watchlist = await watchlistService.getWatchlist(currentProfile.id);
      
      const movies = watchlist.map((item: any) => ({
        id: parseInt(item.movies.tmdb_id),
        title: item.movies.title,
        overview: item.movies.description,
        poster_path: item.movies.poster_url,
        backdrop_path: item.movies.backdrop_url,
        vote_average: parseFloat(item.movies.rating || '0'),
        release_date: item.movies.release_year?.toString(),
        media_type: item.movies.type,
      }));

      setMyListMovies(movies);
      setWatchlistMovieIds(movies.map((m: Movie) => m.id));
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const fetchContinueWatching = async () => {
    if (!currentProfile) return;

    try {
      const history = await watchHistoryService.getContinueWatching(currentProfile.id);
      
      const movies = history.map((item: any) => ({
        id: parseInt(item.movies.tmdb_id),
        title: item.movies.title,
        overview: item.movies.description,
        poster_path: item.movies.poster_url,
        backdrop_path: item.movies.backdrop_url,
        vote_average: parseFloat(item.movies.rating || '0'),
        release_date: item.movies.release_year?.toString(),
        media_type: item.movies.type,
      }));

      setContinueWatchingMovies(movies);
    } catch (error) {
      console.error('Error fetching continue watching:', error);
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

  const handleRemoveFromContinueWatching = async (movie: Movie) => {
  if (!currentProfile) return;

  try {
    // Remove from UI immediately for better UX
    setContinueWatchingMovies(prev => prev.filter(m => m.id !== movie.id));
    
    // Then remove from database
    await watchHistoryService.removeFromContinueWatching(currentProfile.id, movie.id);
  } catch (error) {
    console.error('Error removing from continue watching:', error);
    // Revert UI change if database delete failed
    fetchContinueWatching();
  }
};


  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
    
    // Add to continue watching when user starts watching
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
    
    // Refresh continue watching after closing player
    if (currentProfile) {
      fetchContinueWatching();
    }
  };

  // Show loading if no profile selected yet
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
        <p className="text-white text-xl">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black pb-20">
      <Navbar />
      
      {featuredMovie && (
        <Banner
          title={featuredMovie.title || featuredMovie.name || ''}
          description={featuredMovie.overview}
          backgroundImage={tmdbService.getBackdropUrl(featuredMovie.backdrop_path)}
          trailerUrl=""
        />
      )}

      <div className="relative -mt-20 md:-mt-40 z-30">
        {continueWatchingMovies.length > 0 && (
          <MovieRow
            title="Continue Watching"
            movies={continueWatchingMovies}
            onMovieClick={handleMovieClick}
            onAddToList={handleAddToList}
            onRemove={handleRemoveFromContinueWatching}
            watchlistMovieIds={watchlistMovieIds}
            showRemoveButton={true}
          />
        )}

        {myListMovies.length > 0 && (
          <MovieRow
            title="My List"
            movies={myListMovies}
            onMovieClick={handleMovieClick}
            onAddToList={handleAddToList}
            watchlistMovieIds={watchlistMovieIds}
          />
        )}

        <MovieRow
          title="Trending Now"
          movies={trending}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Netflix Originals"
          movies={netflixOriginals}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Popular Movies"
          movies={popularMovies}
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

        <MovieRow
          title="Top Rated"
          movies={topRated}
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

export default Notflix;
