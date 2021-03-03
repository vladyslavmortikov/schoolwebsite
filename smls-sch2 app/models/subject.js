const mongoose = require('mongoose');
const fs = require('fs');
var moment = require('moment');

const SubjectSchema = new mongoose.Schema({
    name: { type: String },
    teacherId: { type: String},
    registeredAt: {type: Date, default: Date.now },
    isDisabled: { type: Boolean, default: false}
});

const SubjectModel = mongoose.model('Subject', SubjectSchema);

class Subject {

    constructor( name, teacherId) {
        this.name = name; 
        this.teacherId = teacherId;
        this.registeredAt = moment().toISOString();
        this.isDisabled = false;
    }
    
    static getById(id) {
        return SubjectModel.findById(id);
    }
    static insert(subject) {
        return new SubjectModel(subject).save();
    }
    static deleteById(id) {
        return SubjectModel.findByIdAndDelete(id);
    }

    static getAll() {

        return SubjectModel.find();
    }
};
module.exports = Subject;