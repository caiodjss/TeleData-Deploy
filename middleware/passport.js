const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../database/models/user");

// PROCEDIMENTO: Configurar estratégia Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,       
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        user = await User.create({
          full_name: profile.displayName,
          email: profile.emails[0].value,
          password_hash: "",
          is_active: true
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;
