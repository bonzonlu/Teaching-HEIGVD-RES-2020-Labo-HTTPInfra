const Chance = require('chance');
const express = require('express');

const chance = new Chance();
const app = express();

app.get('/', (req, res) => {
  res.send(generateStudents());
});

app.listen(3000, () => {
  console.log('Accepting HTTP requests on port 3000.');
});

function generateStudents() {
  const nbStudents = chance.integer({
    min: 0,
    max: 10,
  });

  console.log(nbStudents);

  let students = [];

  for (let i = 0; i < nbStudents; ++i) {
    let gender = chance.gender();
    let bday = chance.year({
      min: 1986,
      max: 2000,
    });

    students.push({
      firstName: chance.first({
        gender: gender,
      }),
      lastName: chance.last(),
      gender: gender,
      birthday: chance.birthday({
        year: bday,
      }),
    });
  }

  console.log(students);

  return students;
}