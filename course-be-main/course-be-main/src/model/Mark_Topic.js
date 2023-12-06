const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MarkModel = new Schema({
    student_id: {
        type: String,
        required: true,
    },
    
    exam_id: {
        type: String,
        required: true,
    },

    topic_id: {
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
module.exports = mongoose.model("mark_Topic", MarkModel);