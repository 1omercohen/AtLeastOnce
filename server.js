const express = require('express');
const path = require('path');
const db = require('./config/db');
const server = express();

db.init()
    .then(db.loadModels)
    .then(db.atLeastOnce)
    .then(() => {
        const controller = require('./controllers');

        server.use(express.json());
        server.use(express.urlencoded({ extended: false }));
        server.use('/', express.static(path.resolve(__dirname, "views")));
        server.route('/register').post(controller.postRegistration);
        server.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })