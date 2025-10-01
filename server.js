require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { connectToDb, getDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: true, // This allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Session setup
app.set('trust proxy', 1); // trust first proxy

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'none',
    },
    name: 'sessionId'
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware to log session and auth status
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('Session:', req.session);
  next();
});

// Middleware to attach db object to every request
app.use((req, res, next) => {
  try {
    req.db = getDb();
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', require('./routes'));

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production'
        ? 'https://cse341-p-wfbq.onrender.com/auth/github/callback'
        : 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'] // Request email scope
    },
    function (accessToken, refreshToken, profile, done) {
      // Log the profile for debugging
      console.log('GitHub Profile:', profile);
      // Store the access token in the profile
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } else {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
});


