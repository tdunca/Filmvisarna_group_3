import React, { useEffect, useState } from 'react';
import MovieComponent from '../MovieComponent/MovieComponent';
import Button from '../FrontPageButton/FrontPageButton';
import './MovieCollectionSection.scss';
import 'bootstrap/dist/css/bootstrap.min.css'; 

interface Movie {
  _id: string;
  title: string;
  genre: string[];
  year: number;
  poster: string;
  ageRestriction: number;
}

const MovieCollectionSection: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterField, setFilterField] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movie');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleFilter = (field: string | null, value: string | null) => {
    setFilterField(field);
    setFilterValue(value);
  };

  const filteredMovies = filterField && filterValue
    ? movies.filter((movie) => {
        const fieldValue = movie[filterField as keyof Movie];
        return Array.isArray(fieldValue)
          ? fieldValue.includes(filterValue)
          : fieldValue === filterValue;
      })
    : movies;

  return (
    <div className="container py-5">
      <section className="movie-collection-section">
        
        
        <div className="sorting-button-container text-center mb-4">
          <Button className="btn btn-primary mx-2" text="Alla Filmer" onClick={() => handleFilter(null, null)} />
          <Button className="btn btn-secondary mx-2" text="Barn & Familj" onClick={() => handleFilter('genre', 'Family')} />
          <Button className="btn btn-secondary mx-2" text="Senaste" onClick={() => handleFilter('year', '2024')} />
          <Button className="btn btn-secondary mx-2" text="Klassiker" onClick={() => handleFilter('genre', 'Classics')} />
        </div>
        
        
        <div className="row">
          {filteredMovies.map((movie) => (
            <div key={movie._id} className="col-sm-6 col-md-4 col-lg-2 mb-4">
              <MovieComponent
                _id={movie._id}
                title={movie.title}
                year={movie.year}
                poster={movie.poster}
                genre={movie.genre}
                ageRestriction={movie.ageRestriction}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieCollectionSection;
