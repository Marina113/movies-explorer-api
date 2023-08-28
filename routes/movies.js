const movieRouter = require('express').Router();

const { getMovies, delMoviesById, createMovies } = require('../controllers/movies');
const { createMoviesValidation, delMoviesByIdValidation } = require('../middlewares/validation');

movieRouter.get('/movies', getMovies);
movieRouter.delete('/movies/:movieId', delMoviesByIdValidation, delMoviesById);
movieRouter.post('/movies', createMoviesValidation, createMovies);

module.exports = movieRouter;
