import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Browse/Navbar";
import MovieRow from "../components/Browse/MovieRow";
import VideoPlayer from "../components/Browse/VideoPlayer";
import { tmdbService, type Movie, GENRES } from '../services/tmdb';
import { watchlistService } from '../services/watchlist';
import { watchHistoryService } from '../services/watchHistory';
import { useProfile } from '../contexts/ProfileContext';

function MoviesPage() {
  const { currentProfile, profiles } = useProfile();
  const navigate = useNavigate();

  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<Movie[]>([]);
  const [myListMovies, setMyListMovies] = useState<Movie[]>([]);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<Movie[]>([]);
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

    fetchMovies();
    if (currentProfile) {
      fetchWatchlist();
      fetchContinueWatching();
    }
  }, [currentProfile, profiles]);

  const fetchMovies = async () => {
    try {
      const [
        popularData,
        topRatedData,
        actionData,
        comedyData,
        horrorData,
        dramaData,
        romanceData,
        sciFiData,
      ] = await Promise.all([
        tmdbService.getPopularMovies(),
        tmdbService.getTopRated(),
        tmdbService.getMoviesByGenre(GENRES.ACTION),
        tmdbService.getMoviesByGenre(GENRES.COMEDY),
        tmdbService.getMoviesByGenre(GENRES.HORROR),
        tmdbService.getMoviesByGenre(GENRES.DRAMA),
        tmdbService.getMoviesByGenre(GENRES.ROMANCE),
        tmdbService.getMoviesByGenre(GENRES.SCIENCE_FICTION),
      ]);

      setPopularMovies(popularData);
      setTopRated(topRatedData);
      setActionMovies(actionData);
      setComedyMovies(comedyData);
      setHorrorMovies(horrorData);
      setDramaMovies(dramaData);
      setRomanceMovies(romanceData);
      setSciFiMovies(sciFiData);

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
    const movies = watchlist
      .filter((item: any) => item.movies.type === 'movie')
      .map((item: any) => ({
        id: parseInt(item.movies.tmdb_id),
        title: item.movies.title,
        overview: item.movies.description,
        poster_path: item.movies.poster_url,
        backdrop_path: item.movies.backdrop_url,
        vote_average: parseFloat(item.movies.rating || '0'),
        release_date: item.movies.release_year?.toString(),
        media_type: 'movie' as const, // Add "as const" to fix type
      }));

    setMyListMovies(movies);
    setWatchlistMovieIds(movies.map((m) => m.id));
  } catch (error) {
    console.error('Error fetching watchlist:', error);
  }
};

const fetchContinueWatching = async () => {
  if (!currentProfile) return;

  try {
    const history = await watchHistoryService.getContinueWatching(currentProfile.id);
    const movies = history
      .filter((item: any) => item.movies.type === 'movie')
      .map((item: any) => ({
        id: parseInt(item.movies.tmdb_id),
        title: item.movies.title,
        overview: item.movies.description,
        poster_path: item.movies.poster_url,
        backdrop_path: item.movies.backdrop_url,
        vote_average: parseFloat(item.movies.rating || '0'),
        release_date: item.movies.release_year?.toString(),
        media_type: 'movie' as const, // Add "as const" to fix type
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
      setContinueWatchingMovies(prev => prev.filter(m => m.id !== movie.id));
      await watchHistoryService.removeFromContinueWatching(currentProfile.id, movie.id);
    } catch (error) {
      console.error('Error removing from continue watching:', error);
      fetchContinueWatching();
    }
  };

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    
    if (currentProfile) {
      watchHistoryService.addToContinueWatching(currentProfile.id, movie);
    }
    
    try {
      const details = await tmdbService.getDetails(movie.id, 'movie');
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
    
    if (currentProfile) {
      fetchContinueWatching();
    }
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
        <p className="text-white text-xl">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black pb-20">
      <Navbar />
      
      <div className="pt-24 z-30">
        <h1 className="text-white text-4xl font-bold px-4 md:px-12 mb-8">Movies</h1>

        {continueWatchingMovies.length > 0 && (
          <MovieRow
            title="Continue Watching Movies"
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
            title="My Movie List"
            movies={myListMovies}
            onMovieClick={handleMovieClick}
            onAddToList={handleAddToList}
            watchlistMovieIds={watchlistMovieIds}
          />
        )}

        <MovieRow
          title="Popular Movies"
          movies={popularMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Top Rated Movies"
          movies={topRated}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Action Movies"
          movies={actionMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Comedy Movies"
          movies={comedyMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Horror Movies"
          movies={horrorMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Drama Movies"
          movies={dramaMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Romance Movies"
          movies={romanceMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Sci-Fi Movies"
          movies={sciFiMovies}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />
      </div>

      {showPlayer && selectedMovie && movieDetails && (
        <VideoPlayer
          imdbId={movieDetails.external_ids?.imdb_id}
          tmdbId={selectedMovie.id.toString()}
          type="movie"
          title={selectedMovie.title || 'Unknown'}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}

export default MoviesPage;
