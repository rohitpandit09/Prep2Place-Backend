const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    topic : String,

    subtopic : String,

    numberOfQuestions : Number,

    difficulty : String,

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
    ]


})

module.exports = mongoose.model('Questions',questionSchema);