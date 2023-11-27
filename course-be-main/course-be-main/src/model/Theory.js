const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const TheoryModel = new Schema({
    // Theory: [
    //     {
    //         nameQuestion: {
    //             type: String,
    //             required: true  
    //         },
    //         answer: {
    //             type: String,
    //             required: true  
    //         }
    //     }
    // ],
    Theory : {
        type:[Object]

    },

    Topic_id: {
        type: String,
        require: true
        
    }

    


}, {
    timestamps: true
})
module.exports = mongoose.model('Theory', TheoryModel)