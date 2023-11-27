const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const TopicModel = new Schema({
    TopicName : {
        type: String,
        required: true,

    },

    Lecture_ID : {
        type: String,
        // required: true,
    }

   
}, {
    timestamps: true
})
module.exports = mongoose.model('Topic', TopicModel)
