const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { googleClientId, googleClientSecret } = require("../config");

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName;

        let user = await User.findOne({ username });

        if (!user) {
          // Gunakan password random untuk user yang login via Google
          const dummyPassword = "oauth_google_user";
          user = await User.create({
            username,
            password: dummyPassword,
            email,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
