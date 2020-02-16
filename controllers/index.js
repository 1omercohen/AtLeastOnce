const mongoose = require('mongoose');
const axios = require('axios');
const { check, validationResult } = require('express-validator');
const User = mongoose.model('User');
const AtLeast = mongoose.model('AtLeast');
const config = require('../config');

const postRegistration = ([
    check('email').isEmail(),
    check('firstName').trim().isString().notEmpty(),
    check('lastName').trim().isString().notEmpty(),
    check('favorite').trim().isString().isIn(['dog','fox'])
],(req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }
    let newUser = new User({email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, created: new Date()});
    let newAtLeast = new AtLeast({email: req.body.email, favorite: req.body.favorite});
    return Promise.all([
        newUser.save(),
        newAtLeast.save()
    ]).then(([user, atLeast]) => {
        res.status(200).json({status: true});
        return Promise.all([user, atLeast, axios.get(config.animalApi[req.body.favorite])]);
    }).then(([user, atLeast, animalInfo]) => {
        let animalFavorite = {...animalInfo.data, name: req.body.favorite};
        return Promise.all([User.findOneAndUpdate({_id: user._id}, {$set: { favoriteAnimal: animalFavorite}}), atLeast])
    }).then(([userUpdated, atLeast]) => {
        return AtLeast.findOneAndUpdate({_id: atLeast._id}, {$set: {isDone: true}});
    }).catch(error => {
        res.status(500).json({status: false})
    })

});

module.exports = {
    postRegistration: postRegistration
};