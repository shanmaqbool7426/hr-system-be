var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose");
var app = express();
var { whitelist, MONGO_DB_URI, DEBUG } = require("../app/util/config");
const { NotFound } = require('../app/util/helpers');

mongoose.connect(MONGO_DB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.info("Database Connected successfully");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '.../', 'public')));

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
    // if (!origin || whitelist.indexOf(origin) !== -1) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("Not allowed by CORS"));
    // }
  },
  credentials: true,
}));

app.use((req, res, next) => {
  res.language = req.headers["Accept-Language"] || "en"
  next()
})

app.get("/", (req, res, next) => {
  return res.send("Live")
})

app.use("/api", require('../app/routes'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return NotFound(res)
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  if (DEBUG) console.error(err);
});

module.exports = app;
