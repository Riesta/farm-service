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
        const name = profile.displayName;
        const picture = profile.photos[0].value;
        const providerId = profile.id;

        // Cari user berdasarkan email (bukan username, agar unik)
        let user = await User.findOne({ email });

        if (!user) {
          // Buat user baru untuk login via Google
          user = await User.create({
            email,
            name,
            role: "employee", // default role untuk Google user
            profilePicture: picture,
            oauth: {
              provider: "google",
              providerId: providerId,
            },
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize & Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
