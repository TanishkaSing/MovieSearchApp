import React from 'react';
import FavoriteIcon from './assets/heart-filled.png';
import FavoriteBorderIcon from './assets/heart-outline.png';

const MovieCard = ({ movie, onFavoriteToggle, isFavorite }) => {
  const { imdbID, Year, Poster, Title, Type } = movie;
  
  return (
    <div className="movie" key={imdbID}>
      <div className="movie-poster">
        <img
          src={Poster !== 'N/A' ? Poster : 'https://via.placeholder.com/400'}
          alt={Title}
        />
      </div>
      <div className="movie-details">
        <h3>{Title}</h3>
        <span>{Type}</span> <br/>
        <span>{Year}</span>
        <img
          src={isFavorite ? FavoriteIcon : FavoriteBorderIcon }
          alt="Favorite Icon"
          className="favorite-icon"
          onClick={() => onFavoriteToggle(movie)}
        />
      </div>
    </div>
  );
};


export default MovieCard;