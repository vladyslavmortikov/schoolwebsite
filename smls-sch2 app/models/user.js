const fs = require('fs');
const mongoose = require('mongoose');
var moment = require('moment');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String},
    name: { type: String},
    registeredAt: { type: Date, default: Date.now },
    avaUrl: { type: String, default: 'http://immh.kiev.ua/wp-content/uploads/2017/11/default.png' },
    role: { type: String, default: "user" },
    isDisabled: { type: Boolean, default: false }

});
const UserModel = mongoose.model('User', UserSchema);
class User {

    constructor(login, password, name) {
        //this.id = id; // number
        this.login = login;  // string
        this.password = password;
        this.name = name;  // string
        this.registeredAt = moment().toISOString();
        this.avaUrl = "http://immh.kiev.ua/wp-content/uploads/2017/11/default.png";
        this.role = "user";
        this.isDisabled = false;
    }

    static getById(id) {
        return UserModel.findById(id);
    }

    static insert(user) {
        return new UserModel(user).save();
    }
    static update(id, user) {
        return UserModel.findByIdAndUpdate(id, user);
    }
    static deleteById(id) {
        return UserModel.findByIdAndDelete(id);
    }
    static getByLogin(login) {
        return UserModel.findOne({ login: login});
    }
    static getAll() {

        return UserModel.find();
    }
    static getByLoginAndHashPass(username, hashedPass) {
        return UserModel.findOne({ login: username, password: hashedPass });
    }
};
module.exports = User;
