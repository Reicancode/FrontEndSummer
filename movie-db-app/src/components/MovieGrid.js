import React from 'react';
import MovieItem from './MovieItem';

function MovieGrid({ movies, onSelect }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {movies.map((movie) => (
        <MovieItem key={movie.imdbID} movie={movie} onClick={() => onSelect(movie.imdbID)} />
      ))}
    </div>
  );
}

export default MovieGrid;
