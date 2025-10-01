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
  origin: ['https://cse341-p-wfbq.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'sessionId' // Change cookie name from connect.sid
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

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
    },
    function (accessToken, refreshToken, profile, done) {
      // In a real app, you would find or create a user in your database
      // For this example, we'll just pass the profile along.
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


