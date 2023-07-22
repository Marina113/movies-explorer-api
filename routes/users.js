const userRouter = require('express').Router();

const {
  updateProfileValidation,
} = require('../middlewares/validation');

const {
  updateProfile,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/users/me', getUserInfo);
userRouter.patch('/users/me', updateProfileValidation, updateProfile);

module.exports = userRouter;
