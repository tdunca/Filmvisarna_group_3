
import React from 'react';
import { useParams } from 'react-router-dom';
import MovieInfoPage from '../../../components/MovieInfoPage/MovieInfoPage';

const MovieInfo: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="movie-info-page">
      <MovieInfoPage movieId={id} />

    </div>
  );
};

export default MovieInfo;