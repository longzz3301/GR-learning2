const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MarkModelYear = new Schema({
    student_id: {
        type: String,
        required: true,
    },
    

    courseId: {
        type: String,
        required: true,
    },

    SchoolYearsID: {
        type: String,
        required: true,
    },

    
    mark: {
        type: Number,
        required: true
    },
    
    
}, {
    timestamps: true
});
module.exports = mongoose.model("mark_Year", MarkModelYear);