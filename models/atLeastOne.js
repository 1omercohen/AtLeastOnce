const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AtLeastOnceSchema = new Schema({
    email: {
        type: String
    },
    fevorite: {
        type: String
    },
    isDone: {
        type: Boolean,
        default: false
    }
});

const AtLeast = mongoose.model('AtLeast', AtLeastOnceSchema);

module.exports = AtLeast;