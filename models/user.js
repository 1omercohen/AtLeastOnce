const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    favoriteAnimal: {
      type: Object
    },
    created: {
        type: Date
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;