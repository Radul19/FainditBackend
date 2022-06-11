const ctrl = {}
const User = require('./models/User');
// const Serie = require('./models/Serie');
const bcrypt = require('bcrypt')
const { v4 } = require('uuid');
// const fs = require('fs')
// const moment = require('moment');

const c_e_m = {
    ok: false,
    msg: "No se ha podido realizar la operación"
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

        if (searchEmail) {

            return res.status(406).json({
                ok: false,
                msg: "El correo ya estan en uso"
            })
        }


        const salt = bcrypt.genSaltSync()
        const cryptPass = bcrypt.hashSync(password, salt)


        const id = v4()

        // const newUser = { name, email, password: cryptPass, age, country, id, place, adress, phone, interest };
        const newUser = new User({ name, email, password: cryptPass, age, country, id, place, adress, phone, interest });
        await newUser.save()

        res.json({
            ok: true,
            msg: "Cuenta creada con exito"
        })


    } catch (error) {

        return res.status(404).json(c_e_m)
    }

}

ctrl.login = async (req, res) => {

    try {
        const { email, password } = req.body
        const searchEmail = await User.findOne({ email })

        if (searchEmail) {
            const passwordValidator = bcrypt.compareSync(password, searchEmail.password)

            if (passwordValidator) {
                return res.send(searchEmail)
            } else {
                return res.status(404).json({
                    ok: false,
                    msg: "Contraseña incorrecta"
                })
            }

        } else {
            return res.status(404).json({
                ok: false,
                msg: "No hay usuario registrado con ese nombre"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }


}


const abcde = {
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