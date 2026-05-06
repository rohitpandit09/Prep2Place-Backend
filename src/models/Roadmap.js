const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    skill : {
        type: String,
        required : true
    },

    steps : [
        {
            stepNo : String,
            topicName : String,
            estimatedTime : String,
            description : String,
            resourceLink : String,
            isCompleted : {
                type : Boolean,
                default : false
            }
        }
    ]
})

module.exports = mongoose.model('Roadmap',roadmapSchema);