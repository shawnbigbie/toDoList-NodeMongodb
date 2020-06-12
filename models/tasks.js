const mongoose = require('mongoose');

const tasks = new mongoose.Schema({
    toDo: {type:String, required:true, unique:true},
    timeUploaded: {type:Date, required:true, unique: true},
    status: {type:Boolean, required:false}
}, {
    toObject: {
        virtuals: true
    }
});


module.exports = mongoose.model('tasks', tasks);