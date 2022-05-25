require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { readdirSync } = require("fs");

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors
app.use((req, res, next) => {
  const allowedOrigins = ["*"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "content-type, Authorization");
  next();
});

// routes
readdirSync("./routes").map((routeName) => {
  app.use("/api/v1", require(`./routes/${routeName}`));
});

app.get("/", (req, res) => {
  res.send({
    status: "Active",
  });
});

module.exports = app;
