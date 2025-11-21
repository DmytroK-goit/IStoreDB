import { ONE_DAY } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import { loginUser, logoutUser, registerUser } from '../services/users.js';

export const registerUserController = async (req, res) => {
  const credentials = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const user = await registerUser(credentials);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  };

  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY * 30,
  });

  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60, //one hours
  });

  res.cookie('sessionId', session._id, {
    ...cookieOptions,
    maxAge: ONE_DAY * 30,
  });
};

export const loginUserController = async (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };

  const { session, user } = await loginUser(credentials);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { user },
  });
};

export const logoutUserController = async (req, res) => {
  const user = req.user;

  await logoutUser(user);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.status(204).send();
};
export const userProfile = async (req, res) => {
  try {
    const user = await UsersCollection.findById(req.user._id).select('+role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await UsersCollection.find().select('-password');
    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved users!',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UsersCollection.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully deleted user!',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    const user = await UsersCollection.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated user role!',
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
