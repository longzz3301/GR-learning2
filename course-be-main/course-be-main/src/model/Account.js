const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AccountModel = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        // required: true
    },
    course_id : {
        type: String 
        
    },

    school_yearid : [String] ,
    level: {
        type: String,
        default: "1"
    },
    // dob: {
    //     type: String,
    //     // required: true
    // },
    // phone: {
    //     type: String,
    //     // unique: true
    // },
    // sex: {
    //     type: String
    // },
    // avatar: {
    //     type: String
    // },
    // verifyAccount: {
    //     type: Boolean,
    //     default: false
    // },



    
    

}, {
    timestamps: true
});
module.exports = mongoose.model("Account", AccountModel);