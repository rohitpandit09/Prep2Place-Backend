const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },

    email : {
        type:String,
        required:true,  
    },

    password : {
        type:String,
        required:true
    },  

    mobile : {
        type:String,
        required:true
    },

    linkedIn : {
        type:String,
        default:''
    },

    githubId : {
        type:String,
        default:''
    },

    portFolio : {
        type:String,
        default:''
    }
});

module.exports = mongoose.model('User', userSchema);

