require("dotenv").config();

const https = require("https");
const fs = require("fs");

const express = require("express");
const apicache = require("apicache");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const speedLimiter = require("./middleware/speedLimiter");
const limiter = require("./middleware/limiter");
const authenticate = require("./middleware/authenticate");
const setupServiceProxy = require("./utils/proxy");

const app = express();
const cache = apicache.middleware;
const durasiCache = process.env.CACHE_DURATION;

const PORT = process.env.API_GATEWAY_PORT;

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());

app.use(limiter);
app.use(speedLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK api gateway belom R.I.P" });
});

app.use(
  "/api/auth",
  setupServiceProxy("/api/auth/", process.env.AUTH_SERVICE_URL)
);
app.use(
  "/api/farm",
  authenticate,
  cache(durasiCache),
  setupServiceProxy("/api/farm/", process.env.FARM_SERVICE_URL)
);
app.use(
  "/api/product",
  authenticate,
  setupServiceProxy("/api/product/", process.env.PRODUCT_SERVICE_URL)
);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

const privateKey = fs.readFileSync("./key.pem", "utf8");
const certificate = fs.readFileSync("./cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`API Gateway berjalan aman di port ${PORT} (HTTPS)`);
});
// app.listen(PORT, () => {
//   console.log(`API Gateway berjalan di port ${PORT}`);
// });
