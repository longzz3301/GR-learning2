const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const TheoryModel = new Schema({
    Theory: [
        {
            nameQuestion: {
                type: String,
                required: true  
            },
            answer: {
                type: String,
                required: true  
            }
        }
    ],

    Topic_id: {
        type: String,
        
    }

    


}, {
    timestamps: true
})
module.exports = mongoose.model('Theory', TheoryModel)