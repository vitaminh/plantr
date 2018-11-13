const { db, Plot, Vegetable, Gardener } = require('./models');
const sequelize = require('sequelize');

const tomatoe = Vegetable.create({
  name: 'tomatoe',
  color: 'red',
  planted_on: 2018 - 11 - 13,
});
const brocolli = Vegetable.create({
  name: 'brocolli',
  color: 'green',
  planted_on: 2018 - 11 - 13,
});
const squash = Vegetable.create({
  name: 'squash',
  color: 'yellow',
  planted_on: 2018 - 11 - 13,
});
const corn = Vegetable.create({
  name: 'corn',
  color: 'gold',
  planted_on: 2018 - 11 - 13,
});

/*const gardener = Gardener.create({
  name: 'Andy',
  age: 64,
  favorite_vegetable: 1,
});*/

Promise.all([tomatoe, brocolli, squash, corn /*gardener*/])
  .then(db.sync({ force: true }))
  .then(() => {
    console.log('database synced!!!');
  })
  .catch(err => {
    console.log('DISASTER!!!111!!! Something went wrong!!!!!');
    console.log(err);
  })
  .finally(() => {
    db.close();
  });
