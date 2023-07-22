const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: 'https://w.forfun.com/fetch/b7/b77ae3f6f1afd7a4ed41fa4be58015a6.jpeg',
  },
  trailerLink: {
    type: String,
    required: true,
    default: 'https://yandex.ru/video/preview/6555792198882898959',
  },
  thumbnail: {
    type: String,
    required: true,
    default: 'https://w.forfun.com/fetch/b7/b77ae3f6f1afd7a4ed41fa4be58015a6.jpeg',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
