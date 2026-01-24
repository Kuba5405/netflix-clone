import { supabase } from '../lib/supabase';
import type { Movie } from './tmdb';

export const watchHistoryService = {
  // Add movie to continue watching (no progress tracking)
  addToContinueWatching: async (profileId: number, movie: Movie) => {
    // First, check if movie exists in movies table
    const { data: existingMovie } = await supabase
      .from('movies')
      .select('id')
      .eq('tmdb_id', movie.id.toString())
      .single();

    let movieId = existingMovie?.id;

    // If movie doesn't exist, create it
    if (!movieId) {
      const { data: newMovie, error: movieError } = await supabase
        .from('movies')
        .insert({
          title: movie.title || movie.name,
          description: movie.overview,
          tmdb_id: movie.id.toString(),
          imdb_id: null,
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

    // Check if already exists
    const { data: existing } = await supabase
      .from('watch_history')
      .select('id')
      .eq('profile_id', profileId)
      .eq('movie_id', movieId)
      .single();

    if (existing) {
      // Just update the timestamp
      const { error } = await supabase
        .from('watch_history')
        .update({
          last_watched: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new entry (no progress tracking)
      const { error } = await supabase
        .from('watch_history')
        .insert({
          profile_id: profileId,
          movie_id: movieId,
          progress_seconds: 0,
          duration_seconds: 0,
        });

      if (error) throw error;
    }
  },

  // Get continue watching list
  getContinueWatching: async (profileId: number) => {
    const { data, error } = await supabase
      .from('watch_history')
      .select(`
        id,
        last_watched,
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
      .order('last_watched', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Remove from continue watching - use TMDB ID to find and delete
  removeFromContinueWatching: async (profileId: number, tmdbId: number) => {
    try {
      // First get the internal movie ID from TMDB ID
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .select('id')
        .eq('tmdb_id', tmdbId.toString())
        .single();

      if (movieError || !movie) {
        console.error('Movie not found:', movieError);
        return;
      }

      // Then delete from watch_history using the internal movie ID
      const { error: deleteError } = await supabase
        .from('watch_history')
        .delete()
        .eq('profile_id', profileId)
        .eq('movie_id', movie.id);

      if (deleteError) {
        console.error('Error deleting from watch history:', deleteError);
        throw deleteError;
      }
    } catch (error) {
      console.error('Error in removeFromContinueWatching:', error);
      throw error;
    }
  },
};
