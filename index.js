require('dotenv').config();


// Server
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`)
})

// Routes
app.get('/', (req, res) => {
  Movie.findAll({
    order: [
      ['id', 'DESC']
    ],
    attributes: ['id','title', 'rating']
  })
  .then((results) => {
    res.status(200);
    res.send(results);
  }).catch(err => {
    res.status(500);
    res.send('Something broke!');
  })
});

app.post('/', (req, res) => {
  let title = req.body.title;
  let rating = req.body.rating;
  Movie.create({
    title: title,
    rating: rating
  })
  .then((movie) => {
    res.status(200);
    res.send(movie.dataValues);
  })
  .catch((error) => {
    console.error('Error!', error);
    res.status(500);
    res.send('Something broke on the server.');
  })
});

app.delete('/delete/:id', (req, res) => {
  let id = req.params.id;
  Movie.destroy({
    where: {
      id: id
    }
  })
  .then(() => {
    res.status(200);
    res.send({id});
  })
  .catch((error) => {
    res.status(500);
    res.send("Something broke on the server.");
  })
})

// DB
const Sequelize = require('sequelize');
const sequelize = new Sequelize('movies', process.env.DB_USERNAME, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    aquire: 30000,
    idle: 10000
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// DB Models
const Movie = sequelize.import(__dirname + '/models/movie');

// DB Sync
sequelize.sync()
  .then(() => {
    console.log('Sync success');
  })
  .catch((err) => {
    console.error("Database sync failed!", err);
  })
