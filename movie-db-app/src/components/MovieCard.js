import React from 'react';

function MovieCard({ movie, goBack }) {
  return (
    <div style={{ marginTop: '20px', width: '100%' }}>
      <button 
      onClick={goBack} 
      style={{padding: '10px 20px', marginLeft: '10px', borderRadius: '14px', border: '1px solid #ccc', cursor: 'pointer'}}>
        ← Back to search
      </button>
      <h2>{movie.Title} ({movie.Year})</h2>
      <img src={movie.Poster} alt={movie.Title} style={{ width: '200px', float: 'left', marginRight: '20px' }} />
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>Description:</strong> {movie.Plot}</p>
      <p><strong>IMDB rating:</strong> {movie.imdbRating}</p>
    </div>
  );
}

export default MovieCard;
