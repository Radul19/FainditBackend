const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: false },
    id: { type: String, required: true },
    place: { type: String, required: true },
    address: { type: String, required: false },
    country: { type: String, required: false },
    phone: { type: String, required: true },
    profile_pic: { type: String, default: "imagen_vacia" },
    interest: { type: Array, required: false },
    market: { type: Boolean, required: false },
    viewer: { type: Boolean, required: false },
    favorite: { type: Object, required: false },
    notifications: { type: Array, required: false },

})

UserSchema.methods.encryptPassword = async (password) => {

    const salt = bcrypt.genSaltSync()
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


module.exports = model('User', UserSchema)