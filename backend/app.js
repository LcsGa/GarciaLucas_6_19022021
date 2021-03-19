const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
require("dotenv").config();
require("./database");

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express();

// Authorize every origins when sharing ressources between multiple origins
app.use(cors());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
