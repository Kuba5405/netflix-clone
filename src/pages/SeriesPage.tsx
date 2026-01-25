import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Browse/Navbar";
import MovieRow from "../components/Browse/MovieRow";
import VideoPlayer from "../components/Browse/VideoPlayer";
import { tmdbService, type Movie, GENRES } from '../services/tmdb';
import { watchlistService } from '../services/watchlist';
import { watchHistoryService } from '../services/watchHistory';
import { useProfile } from '../contexts/ProfileContext';

function SeriesPage() {
  const { currentProfile, profiles } = useProfile();
  const navigate = useNavigate();

  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [netflixOriginals, setNetflixOriginals] = useState<Movie[]>([]);
  const [actionTV, setActionTV] = useState<Movie[]>([]);
  const [comedyTV, setComedyTV] = useState<Movie[]>([]);
  const [dramaTV, setDramaTV] = useState<Movie[]>([]);
  const [sciFiTV, setSciFiTV] = useState<Movie[]>([]);
  const [myListShows, setMyListShows] = useState<Movie[]>([]);
  const [continueWatchingShows, setContinueWatchingShows] = useState<Movie[]>([]);
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

    fetchShows();
    if (currentProfile) {
      fetchWatchlist();
      fetchContinueWatching();
    }
  }, [currentProfile, profiles]);

  const fetchShows = async () => {
    try {
      const [
        popularData,
        netflixData,
        actionData,
        comedyData,
        dramaData,
        sciFiData,
      ] = await Promise.all([
        tmdbService.getPopularTVShows(),
        tmdbService.getNetflixOriginals(),
        tmdbService.getTVShowsByGenre(GENRES.ACTION_ADVENTURE),
        tmdbService.getTVShowsByGenre(GENRES.COMEDY),
        tmdbService.getTVShowsByGenre(GENRES.DRAMA),
        tmdbService.getTVShowsByGenre(GENRES.SCI_FI_FANTASY),
      ]);

      setPopularTVShows(popularData);
      setNetflixOriginals(netflixData);
      setActionTV(actionData);
      setComedyTV(comedyData);
      setDramaTV(dramaData);
      setSciFiTV(sciFiData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
  if (!currentProfile) return;

  try {
    const watchlist = await watchlistService.getWatchlist(currentProfile.id);
    const shows = watchlist
      .filter((item: any) => item.movies.type === 'tv')
      .map((item: any) => ({
        id: parseInt(item.movies.tmdb_id),
        title: item.movies.title, // Add title field
        name: item.movies.title,
        overview: item.movies.description,
        poster_path: item.movies.poster_url,
        backdrop_path: item.movies.backdrop_url,
        vote_average: parseFloat(item.movies.rating || '0'),
        first_air_date: item.movies.release_year?.toString(),
        media_type: 'tv' as const, // Add "as const" to fix type
      }));

    setMyListShows(shows);
    setWatchlistMovieIds(shows.map((m) => m.id));
  } catch (error) {
    console.error('Error fetching watchlist:', error);
  }
};

const fetchContinueWatching = async () => {
  if (!currentProfile) return;

  try {
    const history = await watchHistoryService.getContinueWatching(currentProfile.id);
    const shows = history
      .filter((item: any) => item.movies.type === 'tv')
      .map((item: any) => ({
        id: parseInt(item.movies.tmdb_id),
        title: item.movies.title, // Add title field
        name: item.movies.title,
        overview: item.movies.description,
        poster_path: item.movies.poster_url,
        backdrop_path: item.movies.backdrop_url,
        vote_average: parseFloat(item.movies.rating || '0'),
        first_air_date: item.movies.release_year?.toString(),
        media_type: 'tv' as const, // Add "as const" to fix type
      }));

    setContinueWatchingShows(shows);
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
        setMyListShows(prev => prev.filter(m => m.id !== movie.id));
      } else {
        await watchlistService.addToWatchlist(currentProfile.id, movie);
        setWatchlistMovieIds(prev => [...prev, movie.id]);
        setMyListShows(prev => [movie, ...prev]);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handleRemoveFromContinueWatching = async (movie: Movie) => {
    if (!currentProfile) return;

    try {
      setContinueWatchingShows(prev => prev.filter(m => m.id !== movie.id));
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
      const details = await tmdbService.getDetails(movie.id, 'tv');
      setMovieDetails(details);
      setShowPlayer(true);
    } catch (error) {
      console.error('Error fetching show details:', error);
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
        <p className="text-white text-xl">Loading TV shows...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black pb-20">
      <Navbar />
      
      <div className="pt-24 z-30">
        <h1 className="text-white text-4xl font-bold px-4 md:px-12 mb-8">TV Shows</h1>

        {continueWatchingShows.length > 0 && (
          <MovieRow
            title="Continue Watching Shows"
            movies={continueWatchingShows}
            onMovieClick={handleMovieClick}
            onAddToList={handleAddToList}
            onRemove={handleRemoveFromContinueWatching}
            watchlistMovieIds={watchlistMovieIds}
            showRemoveButton={true}
          />
        )}

        {myListShows.length > 0 && (
          <MovieRow
            title="My TV Show List"
            movies={myListShows}
            onMovieClick={handleMovieClick}
            onAddToList={handleAddToList}
            watchlistMovieIds={watchlistMovieIds}
          />
        )}

        <MovieRow
          title="Netflix Originals"
          movies={netflixOriginals}
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
          title="Action & Adventure Shows"
          movies={actionTV}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Comedy Shows"
          movies={comedyTV}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Drama Shows"
          movies={dramaTV}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />

        <MovieRow
          title="Sci-Fi & Fantasy Shows"
          movies={sciFiTV}
          onMovieClick={handleMovieClick}
          onAddToList={handleAddToList}
          watchlistMovieIds={watchlistMovieIds}
        />
      </div>

      {showPlayer && selectedMovie && movieDetails && (
        <VideoPlayer
          imdbId={movieDetails.external_ids?.imdb_id}
          tmdbId={selectedMovie.id.toString()}
          type="tv"
          title={selectedMovie.name || 'Unknown'}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}

export default SeriesPage;
