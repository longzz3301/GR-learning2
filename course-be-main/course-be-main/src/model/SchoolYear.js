const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const SchoolYearModel = new Schema({
    nameSchoolYear : {
        type: String,
        required: true,
    },

    courseId : {
        type: String , 
        require: true 
    }



}, {
    timestamps: true
})
module.exports = mongoose.model('SchoolYear', SchoolYearModel)