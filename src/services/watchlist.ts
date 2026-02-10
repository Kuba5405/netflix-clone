import { supabase } from '../lib/supabase';
import type { Movie } from './tmdb';

export interface WatchlistItem {
  id: number;
  profile_id: number;
  movie_id: number;
  added_at: string;
}

export const watchlistService = {
  // Add movie to watchlist
  addToWatchlist: async (profileId: number, movie: Movie) => {
    // First, check if movie exists in movies table
    const { data: existingMovie } = await supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', movie.id.toString())
      .maybeSingle();

    let movieId = existingMovie?.id;

    // If movie doesn't exist, create it
    if (!movieId) {
      const { data: newMovie, error: movieError } = await supabase
        .from('movies')
        .insert({
          title: movie.title || movie.name,
          description: movie.overview,
          tmdb_id: movie.id.toString(),
          imdb_id: null, // Will be fetched when needed
          poster_url: movie.poster_path,
          backdrop_url: movie.backdrop_path,
          release_year: movie.release_date 
            ? new Date(movie.release_date).getFullYear() 
            : movie.first_air_date 
            ? new Date(movie.first_air_date).getFullYear() 
            : null,
          rating: movie.vote_average?.toString(),
          type: movie.media_type || (movie.title ? 'movie' : 'tv'),
        })
        .select()
        .single();

      if (movieError) throw movieError;
      movieId = newMovie.id;
    }

    // Add to watchlist
    const { data, error } = await supabase
      .from('watchlist')
      .insert({
        profile_id: profileId,
        movie_id: movieId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove from watchlist
  removeFromWatchlist: async (profileId: number, tmdbId: number) => {
    // Get movie_id from tmdb_id
    const { data: movie } = await supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', tmdbId.toString())
      .maybeSingle();

    if (!movie) return;

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('profile_id', profileId)
      .eq('movie_id', movie.id);

    if (error) throw error;
  },

  // Get user's watchlist
  getWatchlist: async (profileId: number) => {
    const { data, error } = await supabase
      .from('watchlist')
      .select(`
        id,
        added_at,
        movie_id,
        movies (
          id,
          title,
          description,
          tmdb_id,
          imdb_id,
          poster_url,
          backdrop_url,
          release_year,
          rating,
          type
        )
      `)
      .eq('profile_id', profileId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Check if movie is in watchlist
  isInWatchlist: async (profileId: number, tmdbId: number): Promise<boolean> => {
    const { data: movie } = await supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', tmdbId.toString())
      .maybeSingle();

    if (!movie) return false;

    const { data } = await supabase
      .from('watchlist')
      .select('id')
      .eq('profile_id', profileId)
      .eq('movie_id', movie.id)
      .maybeSingle();

    return !!data;
  },
};
