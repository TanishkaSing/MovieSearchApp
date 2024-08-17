import { useState, useEffect } from "react";
import './App.css';
import SearchIcon from './search.svg';
import MovieCard from "./MovieCard";

const API_URL = 'http://www.omdbapi.com/?apikey=e67c4614';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

 
  const saveFavoriteMovies = () => {
    let savedMovies = localStorage.getItem("favoriteMovies");
    if (savedMovies) {
      setFavoriteMovies(JSON.parse(savedMovies));
    }
  };

  
  const searchMovies = async (title, pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${title}&page=${pageNumber}`);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(prevMovies => [...prevMovies, ...data.Search]);
        setHasMore(data.Search.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const isSaved = (movie) => {
    return favoriteMovies.some(obj => obj.imdbID === movie.imdbID);
  };

  const handleFavoriteClick = (movie) => {
    let savedMovies = localStorage.getItem("favoriteMovies");
    let newFavoriteMovies = [];

    if (savedMovies) {
      const storedMovies = JSON.parse(savedMovies);
      const index = storedMovies.findIndex(obj => obj.imdbID === movie.imdbID);

      if (index >= 0) {
        storedMovies.splice(index, 1);
        newFavoriteMovies = [...storedMovies];
      } else {
        newFavoriteMovies = [...storedMovies, movie];
      }
    } else {
      newFavoriteMovies = [movie];
    }

    localStorage.setItem("favoriteMovies", JSON.stringify(newFavoriteMovies));
    setFavoriteMovies(newFavoriteMovies);
  };

 
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 100 && !loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  
  useEffect(() => {
    saveFavoriteMovies();
    if (searchTerm) {
      searchMovies(searchTerm, page);
    }
  }, [page]);

  useEffect(()=>{
    saveFavoriteMovies()
       searchMovies("Iron man")
     }, [])


  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

 
  useEffect(() => {
    if (searchTerm) {
      setMovies([]);
      setPage(1);
      searchMovies(searchTerm, 1);
    }
  }, [searchTerm]);

  return (
    <div className="app">
      <h1>MovieSpace</h1>
      <div className="search">
        <input
          placeholder="Search For Movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value || e.target.Year ||  e.target.type)}
        />
        <img
          src={SearchIcon}
          alt='search'
          onClick={() => {
            setMovies([]);
            setPage(1);
            searchMovies(searchTerm, 1);
          }}
        />
      </div>

      {movies.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onFavoriteToggle={handleFavoriteClick}
              isFavorite={isSaved(movie)}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No Movies Found</h2>
        </div>
      )}

      {loading && <div className="loading">Loading more movies...</div>}
    </div>
  );
}

export default App;
