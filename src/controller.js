const ctrl = {}
const User = require('./models/User');
// const Serie = require('./models/Serie');
const bcrypt = require('bcrypt')
const { v4 } = require('uuid');
// const fs = require('fs')
// const moment = require('moment');

const c_e_m = {
    ok: false,
    msg: "No se ha podido realizar la operacion"
}


ctrl.home = (req, res) => {
    res.send('Bienvenido a faindit')
}

ctrl.register = async (req, res) => {

    console.log(req.body)

    // res.send(req.body)

    try {

        const { name, age, email, password, country, place, adress, phone, interest } = req.body

        const searchUsername = await User.findOne({ name })
        const searchEmail = await User.findOne({ email })


        if (searchUsername) {
            return res.status(406).json({
                ok: false,
                msg: "El nombre de usuario ya estan en uso"
            })
        }

        if (searchEmail) {

            return res.status(406).json({
                ok: false,
                msg: "El correo ya estan en uso"
            })
        }


        const salt = bcrypt.genSaltSync()
        const cryptPass = bcrypt.hashSync(password, salt)


        const id = v4()

        const newUser = { name, email, password: cryptPass, age, country, id, place, adress, phone, interest };
        // const newUser = new User({ username, email, password: cryptPass, country, id, place, adress, phone, interest });
        // await newUser.save()

        res.send(newUser)


    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }

}


const userData = {
    "name": "Jhon Deep",
    "email": "aver@gmail.com",
    "password": "123123",
    "age": 29,
    "country": "Venezuela",
    "place": "Cabimas",
    "address": "Some adress idk",
    "phone": "0414-2314155",
    "interest": "['interest1', 'interest2', 'interest3', 'interest4', 'interest5',]"
}


module.exports = ctrl