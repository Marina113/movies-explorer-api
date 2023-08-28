const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
// eslint-disable-next-line no-unused-vars
const CastError = require('../errors/castError');
const ValidationError = require('../errors/validationError');
// const ForbiddenError = require('../errors/forbiddenError');

const { OK_CODE } = require('../utils/constants');

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => res.status(OK_CODE).send(movies))
    .catch(next);
};

const delMoviesById = (req, res, next) => {
  // const userId = req.user._id;
  // Movie.findById(req.params.id)
  //   .then((movies) => {
  //     if (!movies) {
  //       throw new NotFoundError('Страница по указанному маршруту не найдена');
  //     }
  //     if (movies.owner.toString() !== userId) {
  //       throw new ForbiddenError('Нельзя удалять чужое видео!');
  //     }
  // Movie.findByIdAndRemove(req.params._id).then(() => res.status(OK_CODE).send(movies));

  // })
  console.log(req.user._id);
  Movie.findOneAndRemove({ movieId: req.params.movieId, owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('фильм не найден');
    })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректный id'));
      }
      return next(err);
    });
};

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const ownerId = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movies) => res.status(OK_CODE).send(movies))
    .catch((err) => {
      console.log(err.stack);
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

// const putLikes = (req, res, next) => {
//   const ownerId = req.user._id;
//   const movieId = req.params._id;
//   Movie.findByIdAndUpdate(movieId, { $addToSet: { likes: ownerId } }, { new: true })
//     .then((movies) => {
//       if (!movies) {
//         throw new NotFoundError('Страница по указанному маршруту не найдена');
//       }
//       res.send(movies);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new ValidationError('Некорректные данные'));
//       } else {
//         next(err);
//       }
//     });
// };

// const delLikes = (req, res, next) => {
//   const ownerId = req.user._id;
//   const movieId = req.params._id;
//   Movie.findByIdAndUpdate(movieId, { $pull: { likes: ownerId } }, { new: true })
//     .then((movies) => {
//       if (!movies) {
//         throw new NotFoundError('Страница по указанному маршруту не найдена');
//       }
//       res.send(movies);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new ValidationError('Некорректные данные'));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports = {
  getMovies,
  delMoviesById,
  createMovies,
};
