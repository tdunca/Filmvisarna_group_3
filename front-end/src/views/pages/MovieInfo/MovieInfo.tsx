import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
const MovieInfo: React.FC = () => {
  const [movieInfo, setMovieInfo] = React.useState<object>({});
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/api/movie/${id}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, [ id ]);
  return (
    <div>
      <h1>Movie Info Page</h1>
      <p>This is the movie information page</p>
      <p>Movie ID: {movieInfo._id}</p>
    </div>
  );
};

export default MovieInfo;