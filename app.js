const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');
const authenticationMiddleware = require('./authenticationMiddleware');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        });

        newUser.save((err) => {
          if (err) {
            return done(err);
          }
          return done(null, newUser);
        });
      }
    });
  }
));

module.exports = passport;


const app = express();
const PORT = process.env.PORT || 3000;
console.log('MongoDB URI:"mongodb+srv://Blog:zaqAlzXatleY3DOJ@cluster0.8gdyrys.mongodb.net/"', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.use(bodyParser.json());
app.use(authenticationMiddleware);
app.use('/users', userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(passport.initialize());
app.use(passport.session()); 