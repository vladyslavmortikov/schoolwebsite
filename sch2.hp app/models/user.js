const mongoose = require('mongoose');
const hashAlg = require('crypto-js');
const secretString = "j123w.o_3*R%g_";


const UserSchema = new mongoose.Schema({
    login: { type: String, required: true},
    password: { type: String, required: true},
    fullName: { type: String, required: true},
    role: { type: Number, default: 0 },
    registeredAt: { type: Date, default: Date.now() },
    photo: { type: String, default: "/user-photo" },
    isDisabled: { type: Boolean, default: false }
});

const UserModel = mongoose.model('User', UserSchema);

UserSchema.methods.generateHash = function (password) {
    return crypto.SHA512(password + secretString).toString();
};

UserSchema.methods.validPassword = (user, password) => {
    console.log(user.password === UserModel.schema.methods.generateHash(password));
    return user.password === UserModel.schema.methods.generateHash(password);
};

UserSchema.methods.getAll = () => {
    return UserModel.find();
};

UserSchema.methods.getById = (id) => {
    return UserModel.findById(id);
};

UserSchema.methods.insert = (user) => {
    return new UserModel(user).save();
};

UserSchema.methods.update = (user) => {
    return UserModel.findOneAndUpdate({ _id: user._id }, { login: user.login, password: user.password, role: user.role, fullName: user.fullName, photo: user.photo });
};

module.exports = UserModel;