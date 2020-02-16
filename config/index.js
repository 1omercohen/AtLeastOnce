const path = require('path');

module.exports = {
    dbUri: "mongodb://localhost:27017/test",
    modelsPath: path.resolve(__dirname, '../models/*.js'),
    animalApi: {
        dog: "https://random.dog/woof.json",
        fox: "https://randomfox.ca/floof/"
    }
}