const db = require('./models')

const {
    vegetable: Vegetable,
    gardener: Gardener,
    plot: Plot,
} = db.models

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

const seed = async () => {
    try {
        await db.sync({ force: true })
        console.log('Database synced!')

        const promiseForInsertedData = Promise.all([
            // `returning: true` is a postgres option returning representations of
            // the new data. Otherwise we get back a success report, not instances.
            Vegetable.bulkCreate(vegetableData, { returning: true }),
            Gardener.bulkCreate(gardenerData, { returning: true }),
            Plot.bulkCreate(plotData, { returning: true })
        ])

        const [ vegetables, gardeners, plots ] = await promiseForInsertedData
        const [carrot, tomato, pepper] = vegetables
        const [mcgregor, hashimoto, giancarlo] = gardeners
        const [mcgregorPlot, hashimotoPlot, giancarloPlot] = plots

        // Here we're using Sequelize's 'Magic' methods to set associations.
        // Each one returns a promise, so we must wrap them in Promise.all
        // to return a single promise that will resolve when they all complete
        await Promise.all([
            mcgregor.setFavoriteVegetable(carrot),
            mcgregorPlot.setGardener(mcgregor),
            mcgregorPlot.setVegetables([ carrot, pepper]),

            hashimoto.setFavoriteVegetable(pepper),
            hashimotoPlot.setGardener(hashimoto),
            hashimotoPlot.setVegetables([ carrot, pepper, tomato ]),

            giancarlo.setFavoriteVegetable(tomato),
            giancarloPlot.setGardener(giancarlo),
            giancarloPlot.setVegetables([ tomato, pepper ]),
        ])

        console.log('Database seeded!')
    } catch (e) {
        console.log('Disaster! Something went wrong!')
        console.log(err)
    } finally {
        console.log('Closing database connection.')
        db.close()
    }
}

seed()
