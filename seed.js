const { db, Plot, Vegetable, Gardener } = require('./models');

db.sync({ force: true })
  .then(() => {
    console.log('database synced!!!');
  })
  .catch(err => {
    console.log('DISASTER!!!111!!! Something went wrong!!!!!');
    console.log(err);
  })
  .finally(() => {
    db.close();
  })
