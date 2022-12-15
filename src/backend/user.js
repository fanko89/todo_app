const {model, Schema} = require('mongoose')
const User = new Schema({
    firstName: String,
    middleName: {
        type: String,
        default: ""
    },
    lastName: String,
    age: Number,
    email: {
        type: String,
        required: true
    }
})

module.exports = model('user', User)