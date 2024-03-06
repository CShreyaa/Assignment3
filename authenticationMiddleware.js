const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const users = [];

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  let user = users.find(u => u.googleId === profile.id);

  if (!user) {
    user = {
      googleId: profile.id,
      displayName: profile.displayName,
    };

    users.push(user);
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.googleId === id);
  done(null, user);
});

module.exports = passport;