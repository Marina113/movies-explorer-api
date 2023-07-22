const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');

const {
  CREATED,
  OK_CODE,
} = require('../utils/constants');

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Страница по указанному маршруту не найдена');
      }
      res.status(OK_CODE).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, // записываем хеш в базу
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.status(CREATED).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Вы ввели неправильный логин или пароль.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Страница по указанному маршруту не найдена');
      }
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Вы ввели неправильный логин или пароль.');
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, login, getUserInfo, updateProfile,
};
