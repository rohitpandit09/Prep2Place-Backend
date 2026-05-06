const mongoose = require('mongoose');

const praticeSchema = new mongoose.Schema({
    
    testScore :{
        type : Number,
        max : 10,
        min : 0,

    },

    softSkillScore : {
        type : Number,
        max : 10,
        min : 0,
    },

    ImprovementAreas : {
        type : String
    },

    ImprovementFromPrevious : {
        type : String,
        default : ""
    }
})

module.exports = mongoose.model('Practice', praticeSchema); 