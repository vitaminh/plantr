const { db, Plot, Vegetable, Gardener } = require('./models');
const sequelize = require('sequelize');

const vegetableData = [
  { name: 'Carrot', color: 'orange' },
  { name: 'Tomato', color: 'red' },
  { name: 'Pepper', color: 'green' },
]

const gardenerData = [
  { name: 'McGregor', age: 60 },
  { name: 'Hashimoto', age: 37 },
  { name: 'Giancarlo', age: 19 },
]

const plotData = [
  { size: 20, shaded: false },
  { size: 40, shaded: true },
  { size: 10, shaded: false },
]

db.sync({ force: true })
  .then(() => {
    console.log('database synced!!!');
    // `returning: true` is a postgres option returning representations of
    // the new data. Otherwise we get back a success report, not instances.
    return Promise.all([
      Vegetable.bulkCreate(vegetableData, { returning: true }),
      Gardener.bulkCreate(gardenerData, { returning: true }),
      Plot.bulkCreate(plotData, { returning: true })
    ])
  })
  .then(insertedData => {
    const [vegetables, gardeners, plots] = insertedData;
    const [carrot, tomato, pepper] = vegetables;
    const [mcgregor, hashimoto, giancarlo] = gardeners;
    const [mcgregorPlot, hashimotoPlot, giancarloPlot] = plots;
    // Here we're using Sequelize's 'Magic' methods to set associations.
    // Each one returns a promise, so we must wrap them in Promise.all
    // to return a single promise that will resolve when they all complete
    return Promise.all([
      mcgregor.setFavoriteVegetable(carrot),
      mcgregorPlot.setGardener(mcgregor),
      mcgregorPlot.setVegetables([carrot, pepper]),

      hashimoto.setFavoriteVegetable(pepper),
      hashimotoPlot.setGardener(hashimoto),
      hashimotoPlot.setVegetables([carrot, pepper, tomato]),

      giancarlo.setFavoriteVegetable(tomato),
      giancarloPlot.setGardener(giancarlo),
      giancarloPlot.setVegetables([tomato, pepper]),
    ])
  })
  .then(() => {
    console.log('Database seeded!');
  })
  .catch(err => {
    console.log('DISASTER!!!111!!! Something went wrong!!!!!');
    console.log(err);
  })
  .finally(() => {
    console.log('connection closing');
    db.close();
  });
