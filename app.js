const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const userRoutes = require("./api/routes/user");
const weatherRoutes = require("./api/routes/weather");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use('/user', userRoutes);
app.use('/weather', weatherRoutes);



app.use((req, res, next) => {
    const error =  new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    });
});

app.get('/', (req, res) => {
    res.json({"message": "Welcome to Weather Application."});
});

module.exports = app;