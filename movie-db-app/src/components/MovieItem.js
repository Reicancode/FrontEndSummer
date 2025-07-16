import React from 'react';

function MovieItem({ movie, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '180px',
        cursor: 'pointer',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '10px'
      }}
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/180x260?text=No+Image"}
        alt={movie.Title}
        style={{ width: '100%', borderRadius: '8px' }}
      />
      <h4>{movie.Title}</h4>
      <p>({movie.Year})</p>
    </div>
  );
}

export default MovieItem;
