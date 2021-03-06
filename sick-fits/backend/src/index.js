const cookieParser = require('cookie-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const createServer = require('./create-server');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

// decode the JWT so we can get the userId on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId on the req for future requests to access
    req.userId = userId;
  }
  next();
});

// create a middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }',
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  (details) => {
    console.log(
      `Server is now running on port http://localhost:${details.port}`,
    );
  },
);
