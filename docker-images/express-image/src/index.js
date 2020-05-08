const Chance = require('chance');
const express = require('express');

const chance = new Chance();
const app = express();

app.get('/', (req, res) => {
  res.send("Welcome to our app!");
});

app.get('/hashtag', (req, res) => {
  res.send(chance.hashtag());
});

app.get('/profile', (req, res) => {
  res.send(generateProfile());
});

app.get('/profile/:count', (req, res) => {
  res.send(generateProfiles(req.params.count));
});

app.listen(3000, () => {
  console.log('Accepting HTTP requests on port 3000.');
});

function generateProfile() {
  const gender = chance.gender();

  return {
    name: chance.name({
      gender: gender,
    }),
    gender: gender,
    pet: chance.animal({
      type: 'pet',
    }),
    email: chance.email(),
    avatar: chance.avatar({
      protocol: 'https'
    }),
    hashtag: chance.hashtag(),
  };
}

function generateProfiles(count) {
  let profiles = [];

  for (let i = 0; i < count; ++i)
    profiles.push(generateProfile());

  return profiles;
}
