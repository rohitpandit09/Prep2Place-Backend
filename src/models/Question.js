const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    topic : {
        type : String,
        required : true
    },  

    subtopic : {
        type : String,
        required : true
    },

    questions : [
        {
            questionNo : Number,
            question : String,
            userAnswer : String,
            AIanswer : String,
            difficulty : String,
            timeTaken : {
                type : Number,
                default : 0
            }
        }
    ],

    
})

module.exports = mongoose.model('Question', questionSchema);