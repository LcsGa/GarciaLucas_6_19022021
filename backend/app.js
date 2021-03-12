const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
require("dotenv").config();

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pnp3d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB Atlas réussie !"))
  .catch(() => console.error("Connexion à MongoDB Atlas échouée !"));

const app = express();

app.use(cors());

app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
