import React, { useState, useEffect } from 'react';

interface Movie {
  _id: string;
  title: string;
  year: number;
  length: number;
  description: string;
  genre: string[];
  distributor: string;
  productionCountries: string[];
  language: string;
  subtitles: string;
  director: string;
  actors: string[];
  poster: string;
  trailer: string;
  ageRestriction: number;
  imdbRating: number;
}

interface MovieInfoPageProps {
  movieId: string | undefined;
}

const MovieInfoPage: React.FC<MovieInfoPageProps> = ({ movieId }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (movieId) {
      // Här gör du en API-förfrågan för att hämta filmen baserat på movieId
      fetch(`/api/movie/${movieId}`)
        .then(response => response.json())
        .then(data => setMovie(data))
        .catch(error => console.error('Error fetching movie:', error));
    }
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="trailer-container">
        <iframe
          width="560"
          height="315"
          src={movie.trailer}
          title={`${movie.title} Trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="movie-info-container">
        <div className="movie-info">
          <h2>{movie.title}</h2>
          <p className="age-restriction">Åldersgräns: {movie.ageRestriction}+</p>
          <p className="genre">Genre: {movie.genre.join(', ')}</p>
          <p className="duration">Längd: {movie.length} min</p>
          <p className="description">{movie.description}</p>

          <div className="movie-info__details">
            <p>Regissör: {movie.director}</p>
            <p>Skådespelare: {movie.actors.join(', ')}</p>
            <p>Originaltitel: {movie.title}</p>
            <p>Språk: {movie.language}</p>
            <p>År: {movie.year}</p>
            <p>Produktionsländer: {movie.productionCountries.join(', ')}</p>
            <p>Distributör: {movie.distributor}</p>
          </div>
        </div>

        <div className="movie-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
      </div>

      {/* Lägg till ScheduleSection här */}
      {/* <ScheduleSection movieId={movieId} selectedDate={currentDate} /> */}
    </div>
  );
};

export default MovieInfoPage;
