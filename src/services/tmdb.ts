const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
}

export const tmdbService = {
  // Get trending movies/shows
  getTrending: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get popular movies
  getPopularMovies: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get popular TV shows
  getPopularTVShows: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get top rated movies
  getTopRated: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get Netflix Originals (using a genre)
  getNetflixOriginals: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`
    );
    const data = await response.json();
    return data.results;
  },

  // Helper: Get full poster URL
  getPosterUrl: (path: string, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'): string => {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : '/placeholder.png';
  },

  // Helper: Get full backdrop URL
  getBackdropUrl: (path: string, size: 'w780' | 'w1280' | 'original' = 'w1280'): string => {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : '/placeholder.png';
  },

  // Get movie/show details including external IDs (IMDB)
  getDetails: async (id: number, type: 'movie' | 'tv'): Promise<any> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`
    );
    return await response.json();
  },
};
