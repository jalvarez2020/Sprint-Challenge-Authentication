const axios = require('axios');
const db = require('../database/dbConfig');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../auth/authenticate');
const { tokenGenerator } = require('../auth/authenticate')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
    const user = req.body;
    user.password = bcrypt.hashSync(user.password)
    const token = tokenGenerator(user.username)
    console.log(token)
    db.insert(user, token)
    .then(respond => {
        res.status(201).json({
          message: "Account Registered", token
        })
    })
    .catch(err => {
      res.status(500).json({message: "error could not register"})
    })

}

function login(req, res,) {
  // implement user login
  const user = req.body;
  console.log(user.username)
  db.findByUsername(user.username)
    .then(users => {
      if (bcrypt.compareSync(user.password, users.password, 10)) {
        const token = tokenGenerator(user.username);
        res.status(200).json({ message: "Logged in", token })
      } else {
        res.status(400).json({message: "incorrect username or password"})
      }
    })
    .catch(err => {
      res.status(404).json({message: "user does not exist"})
    })
    

}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
