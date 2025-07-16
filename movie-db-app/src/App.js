import React, { useState } from 'react';
import MovieGrid from './components/MovieGrid';
import MovieCard from './components/MovieCard';

const API_KEY = "a62da2f4";

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState('');

  const searchMovies = async () => {
    setSelectedMovie(null);
    setError('');
    setMovies([]);

    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
      const data = await res.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error || "Movies not found");
      }
    } catch {
      setError("Network error. Please try again later.");
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`);
    const data = await res.json();
    if (data.Response === "True") {
      setSelectedMovie(data);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1>Movie Searcher</h1>

      {!selectedMovie && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Movie title (Iron Man)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '10px', width: '300px', borderRadius: '14px', border: '1px solid #ccc' }}
          />
          <button 
          onClick={searchMovies} 
          style={{padding: '10px 20px', marginLeft: '10px', borderRadius: '14px', border: '1px solid #ccc', cursor: 'pointer'}}>
            Search
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}

      {selectedMovie ? (
        <MovieCard movie={selectedMovie} goBack={() => setSelectedMovie(null)} />
      ) : (
        <MovieGrid movies={movies} onSelect={fetchMovieDetails} />
      )}
    </div>
  );
}

export default App;
