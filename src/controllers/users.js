// import { ONE_DAY } from '../constants/index.js';
// import { loginUser, logoutUser, registerUser } from '../services/users.js';

// export const registerUserController = async (req, res) => {
//   const credentials = {
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//   };

//   const user = await registerUser(credentials);

//   res.status(201).json({
//     status: 201,
//     message: 'Successfully registered a user!',
//     data: user,
//   });
// };

// const setupSession = (res, session) => {
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY * 30),
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: new Date(Date.now() + ONE_DAY * 30),
//   });
// };

// export const loginUserController = async (req, res) => {
//   const credentials = {
//     email: req.body.email,
//     password: req.body.password,
//   };

//   const { session, user } = await loginUser(credentials);

//   setupSession(res, session);

//   res.status(200).json({
//     status: 200,
//     message: 'Successfully logged in a user!',
//     data: {
//       accessToken: session.accessToken,
//       user,
//     },
//   });
// };

// export const logoutUserController = async (req, res) => {
//   const user = req.user;

//   await logoutUser(user);

//   res.clearCookie('sessionId');
//   res.clearCookie('refreshToken');

//   res.status(204).send();
// };

// export const refreshUsersSessionController = async (req, res) => {
//   const cookies = {
//     sessionId: req.cookies.sessionId,
//     refreshToken: req.cookies.refreshToken,
//   };

//   const session = await refreshUsersSession(cookies);

//   setupSession(res, session);

//   res.status(200).json({
//     status: 200,
//     message: 'Successfully refreshed a session!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };

// export const updateUserController = async (req, res) => {
//   const user = req.user;
//   const userId = user._id;
//   const avatar = req.file;

//   let avatarUrl;

//   if (avatar) {
//     if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
//       avatarUrl = await saveFileToCloudinary(avatar);
//     } else {
//       avatarUrl = await saveFileToUploadDir(avatar);
//     }
//   }

//   const updatedUser = await updateUser(userId, {
//     ...req.body,
//     avatar: avatarUrl,
//   });

//   res.status(200).json({
//     status: 200,
//     message: 'Successfully updated a user!',
//     data: updatedUser,
//   });
// };

// export const getUsersCountController = async (req, res) => {
//   const count = await getUsersCount();

//   res.status(200).json({
//     status: 200,
//     message: 'Successfully retrieved user count!',
//     data: count,
//   });
// };

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
