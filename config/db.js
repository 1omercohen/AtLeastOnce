const mongoose = require('mongoose');
const glob = require('glob')
const axios = require('axios');
const config = require('./index');


const init = () => {
    return mongoose.connect(config.dbUri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
}

const loadModels = () => {
    return new Promise((resolve, reject) => {
        glob(config.modelsPath, (err, files) => {
            if(err)
                reject("no found models files");
            for(let file of files) {
                require(file);
            }
            resolve();
        })
    })
}

const atLeastOnce = () => {
    const AtLeast = mongoose.model('AtLeast');
    const User = mongoose.model('User');
    return AtLeast.find({isDone: false})
        .then(updateList => {
            let listPromises = updateList.map(item => {
                return {
                    email: item.email,
                    animalRequest: axios.get(config.animalApi[item.favorite]),
                    name: item.favorite
                }
            })
            return Promise.all([listPromises, updateList]);
        })
        .then(([mapList, updateList]) => {
            let updateUser = mapList.map(item => {
                let favoriteInfo = {...item.animalRequest.data, name: item.name};
                return User.findOneAndUpdate({email: item.email}, {$set: { favoriteAnimal: favoriteInfo }})
            })
            return Promise.all([updateUser, updateList])
        })
        .then(([usersUpdated, updatedList]) => {
            let markDoneList = updatedList.map(item => AtLeast.findOneAndUpdate({_id: item._id}, {$set: {isDone: true}}))
            return Promise.all(markDoneList);
        })
        .catch(error => {
            console.log(error)
        })
}

module.exports = {
    init: init,
    loadModels: loadModels,
    atLeastOnce: atLeastOnce
}