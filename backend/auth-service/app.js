const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")
const connectDB = require("./config/db");
const { port } = require("./config");

const app = express();
app.use(bodyParser.json());

connectDB(); // 🔌 Koneksi ke MongoDB Atlas

const session = require("express-session");
const passport = require("passport");

app.use(
  session({
    secret: "oauth_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server Berjalan pada port ${port}`);
});
