const mongoose = require('mongoose');
const fs = require('fs');

const MarkSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    subjectId: {type: String, required: true},
    value: {type: Number, required: true},
    description: {type: String},
    date: {type: Date, default: Date.now}
});
   
const MarkModel = mongoose.model('Mark', MarkSchema);

class Mark {
    constructor(id, userId, subjectId, value, description, date) {
        this.id = id;
        this.userId = userId;
        this.subjectId = subjectId;
        this.value = value;
        this.description = description;
        this.date = date;
    }

    static getAll()
    {
        return MarkModel.find();  
    }

    static insert(mark)
    {  
        return new MarkModel(mark).save();
    }

    static getById(id)
    {
        return MarkModel.findById(id);
    }

    static deleteById(id)
    {
        return MarkModel.deleteOne({_id:id});
    }

    static update(newMark)
    {
        return (Promise.resolve(MarkModel.findOneAndUpdate({_id:newMark.id},{value:newMark.value,description:newMark.description})));
    }

 };

module.exports = Mark;
