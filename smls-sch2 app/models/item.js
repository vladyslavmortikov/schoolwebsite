const mongoose = require('mongoose');
const fs = require('fs');

const ItemSchema = new mongoose.Schema({
    title: {type: String, required: true},
    preview: {type: String, required: true},
    photo: {type: String, required: true},
    text: {type: String, required: true},
    postedAt: {type: Date, default: Date.now}
});

const ItemModel = mongoose.model('Item', ItemSchema);

class Item {
    constructor(id, title, preview, photo, text, postedAt) {
        this.id = id;
        this.title = title;
        this.preview = preview;
        this.photo = photo;
        this.text = text;
        this.postedAt = postedAt;
    }

    static getQuantityOfItems(searchword)
    {
        return ItemModel.find({title: {$regex: `(?i).*${searchword}.*(?-i)`}}).countDocuments();
    }

    static getAll(searchword, skp, lm) {
        return ItemModel.find({title: {$regex: `(?i).*${searchword}.*(?-i)`}}).skip(skp).limit(lm);
    }

    static insert(item) {
        return new ItemModel(item).save();
    }

    static getById(id) {
        return ItemModel.findById(id);
    }

    static update(newItem) {
        return (Promise.resolve(ItemModel.findOneAndUpdate({_id:newItem.id},{title:newItem.title,preview:newItem.preview,photo:newItem.photo,text:newItem.text})));
    }

    static deleteById(id) {
        return ItemModel.deleteOne({_id:id});
    }

};



module.exports = Item;
