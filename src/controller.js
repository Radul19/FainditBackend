const ctrl = {}
const db = require("./database")
const User = require('./models/User');
const Item = require('./models/Item');
// const Serie = require('./models/Serie');
const bcrypt = require('bcrypt')
const { v4 } = require('uuid');
const { json } = require("express");
// const fs = require('fs')
const moment = require('moment');

const arrayRemove = (arr, value) => {

    return arr.filter(function (ele) {
        return ele != value;
    });
}

const c_e_m = {
    ok: false,
    msg: "No se ha podido realizar la operación"
}

/// GETTERS
ctrl.home = (req, res) => {
    res.send('Bienvenido a faindit')
}

ctrl.getid = (req, res) => {

    const id = v4()

    res.json({
        ok: true,
        id
    })
}
ctrl.getUsers = async (req, res) => {
    const result = await db.query(`SELECT id,name FROM users`)
    console.log(result)

    res.json(result.rows)
}

ctrl.getMarkets = async (req, res) => {
    const result = await db.query(`SELECT id,name FROM markets`)
    console.log(result)

    res.json(result.rows)
}
ctrl.getItems = async (req, res) => {
    const result = await db.query(`SELECT id,title FROM items`)
    console.log(result)

    res.json(result.rows)
}
ctrl.getItemById = async (req, res) => {
    try {

        const { id } = req.params
        const result = await db.query(`SELECT * FROM items WHERE id = '${id}' `)

        return res.json(result.rows)

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}
ctrl.getUserById = async (req, res) => {
    try {

        const { id } = req.params
        const result = await db.query(`SELECT * FROM users WHERE id = '${id}' `)

        return res.json(result.rows)

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}
ctrl.getMarket = async (req, res) => {
    try {

        const { id } = req.params
        const result = await db.query(`SELECT * FROM markets WHERE id = '${id}' `)

        return res.json(result.rows)

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)

    }
}
ctrl.getPromotions = async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM promotions `)
        return res.json(result.rows)
    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}
ctrl.getTickets = async (req, res) => {
    try {
        const result = await db.query(`SELECT id,title FROM tickets `)
        return res.json(result.rows)
    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

//// 1ST BLOCK

ctrl.register = async (req, res) => {
    try {

        const { name, age, email, password, country, place, adress, phone, interest } = req.body
        const id = v4()


        const searchEmail = await db.query(`SELECT email FROM users WHERE email = '${email}' `)
        if (searchEmail.rows.lenght > 0) {
            return res.status(406).json({
                ok: false,
                msg: "El correo ya estan en uso"
            })
        }

        const salt = bcrypt.genSaltSync()
        const cryptPass = bcrypt.hashSync(password, salt)

        const result = await db.query(`INSERT INTO users (name, age, email, password, country, place, address, phone, interest,id) VALUES ($1, $2, $3, $4 ,$5,$6,$7,$8,$9,$10 )`, [name, age, email, cryptPass, country, place, adress, phone, interest, id])

        res.json({
            ok: true,
            msg: "Cuenta creada con exito",
            id
        })


    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }

}

ctrl.login = async (req, res) => {

    try {
        const { email, password } = req.body
        const searchEmail = await db.query(`SELECT email,password FROM users WHERE email = '${email}' `)

        if (searchEmail.rowCount > 0) {
            const passwordValidator = bcrypt.compareSync(password, searchEmail.rows[0].password)

            if (passwordValidator) {
                return res.send(searchEmail.rows[0])
            } else {
                return res.status(404).json({
                    ok: false,
                    msg: "Contraseña incorrecta"
                })
            }

        } else {
            return res.status(404).json({
                ok: false,
                msg: "No hay usuario registrado con ese correo"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }


}

ctrl.createItem = async (req, res) => {
    try {
        const { marketId, title, description, price, amount, tags, image, place, id } = req.body

        const rate = 0
        const comments = []
        const stadistics = {}

        const result = await db.query(`INSERT INTO items ( marketId, title, description, price, amount, tags, image,place,id) VALUES ($1, $2, $3, $4 ,$5,$6,$7,$8,$9 )`, [marketId, title, description, price, amount, tags, image, place, id])

        res.json({
            ok: true,
            msg: "Articulo creado con exito"
        })


    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.deleteItem = async (req, res) => {
    try {

        const { id } = req.body

        console.log(id)

        const result = await db.query(`DELETE FROM items WHERE id = '${id}' `)

        return res.json({
            ok: true,
            msg: 'Item borrado con exito'
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.search = async (req, res) => {
    try {
        const { text, tags, place, price, p_o, verified, producto, rate } = req.body

        tags.sort()
        /// Selecciona todas las publicaciones que tengan descripcion general o titulo referente a los parametros

        let result

        if (producto) {
            result = await db.query(`
            SELECT * FROM items WHERE (description LIKE '${text}%' OR title LIKE '${text}%') AND (place = $1) AND tags = $2 AND price ${p_o} $3 `, [place, tags, price])
        } else {
            if (tags.lenght > 0) {
                result = await db.query(`
                SELECT * FROM markets WHERE (description LIKE '${text}%' OR name LIKE '${text}%') AND (place = $1) AND categories = $2 AND verified = $3 `, [place, tags, verified])
            } else {
                result = await db.query(`
                SELECT * FROM markets WHERE (description LIKE '${text}%' OR name LIKE '${text}%') AND (place = $1) AND verified = $2  `, [place, verified])
            }
        }

        if (result.rowCount <= 0) {
            return res.json({
                ok: true,
                msg: 'No se encontraron resultados ):'
            })
        } else {
            return res.json(result.rows)
        }
    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}



ctrl.createMarket = async (req, res) => {
    try {

        const { id, name, description, email, password, owner, categories, inventory, membership, stadistics, social, schedule, delivery, address, comments, rate, verified, place } = req.body



        const result = await db.query(`INSERT INTO markets (id,name,description,email,password,owner,categories,inventory,membership,stadistics,social,schedule,delivery,address,comments,rate,verified,place) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`, [id, name, description, email, password, owner, categories, inventory, membership, stadistics, social, schedule, delivery, address, comments, rate, verified, place])

        return res.json({
            ok: true,
            msg: "Comercio creado con exito"
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.deleteMarket = async (req, res) => {
    const { id } = req.body
    const result = await db.query(`DELETE FROM markets WHERE id = '${id}' `)
    return res.json({
        ok: true,
        msg: 'Comercio borrado con exito'
    })
}


ctrl.toggleFavorite = async (req, res) => {
    try {

        const { userId, itemId, type } = req.body



        if (type) {

            const result1 = await db.query(`SELECT favorite FROM users WHERE id = '${userId}' `)

            let arr = result1.rows[0].favorite
            arr.push(itemId)
            arr.sort()

            const result2 = await db.query(`UPDATE users SET favorite = $1 WHERE id = $2`, [arr, userId])

            return res.json({ ok: true, msg: 'Item anexado a favoritos' })
        } else {

            const result1 = await db.query(`SELECT favorite FROM users WHERE id = '${userId}' `)
            let arr = result1.rows[0].favorite
            arr = arrayRemove(arr, itemId)
            arr.sort()

            const result2 = await db.query(`UPDATE users SET favorite = $1 WHERE id = $2`, [arr, userId])

            return res.json({ ok: true, msg: 'Item eliminado de favoritos' })
        }

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.addSubCategory = async (req, res) => {
    try {

        const { id, category } = req.body


        const result1 = await db.query(`SELECT categories FROM markets WHERE id = '${id}' `)
        let arr = result1.rows[0].categories

        arr.push(category)
        arr.sort()

        const result2 = await db.query(`UPDATE markets SET categories = $1 WHERE id = $2`, [arr, id])
        return res.json({ ok: true, msg: 'Categoria añadida' })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}
ctrl.deleteSubCategory = async (req, res) => {
    try {

        const { id, category } = req.body

        const result1 = await db.query(`SELECT categories FROM markets WHERE id = '${id}' `)
        let arr = result1.rows[0].categories

        arr = arrayRemove(arr, category)
        arr.sort()
        const result2 = await db.query(`UPDATE users SET favorite = $1 WHERE id = $2`, [arr, id])

        return res.json({ ok: true, msg: 'Item eliminado de favoritos' })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.addInterest = async (req, res) => {
    try {

        const { id, interest } = req.body

        const result = await db.query(`SELECT interest FROM users WHERE id = '${id}'`)

        let arr = result.rows[0].interest
        arr.push(interest)

        arr.sort()

        const result2 = await db.query(`UPDATE users SET interest = $1 WHERE id = $2`, [arr, id])

        res.json({
            ok: true,
            msg: 'Interes añadido con exito'
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.deleteInterest = async (req, res) => {
    try {

        const { id, interest } = req.body

        const result = await db.query(`SELECT interest FROM users WHERE id = '${id}'`)

        let arr = result.rows[0].interest
        interest.forEach(element => {
            console.log(element)
            arr = arrayRemove(arr, element)
        });
        arr.sort()

        const result2 = await db.query(`UPDATE users SET interest = $1 WHERE id = $2`, [arr, id])

        res.json({
            ok: true,
            msg: 'Interes eliminado/s con exito'
        })


    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

//////////// 2ND BLOCK

ctrl.addPromotion = async (req, res) => {
    try {

        const { marketId, image, redirectId, creation, exp_date, filters } = req.body
        const newTime = moment.unix(creation).format("DD MMM YYYY hh:mm a")
        const newTimeExp = moment.unix(exp_date).format("DD MMM YYYY hh:mm a")

        let newRedirect = ""
        if (redirectId) {
            newRedirect = redirectId
        } else {
            newRedirect = "_empty_"
        }

        const id = v4()

        const result = await db.query(`INSERT INTO promotions (owner, id ,picture, redirect, date, expiration_date, filters) VALUES ($1,$2,$3,$4,$5,$6,$7) `, [marketId, id, image, newRedirect, creation, exp_date, filters])

        res.json({
            ok: true,
            msg: "Promocion añadida con exito",
            date: newTime,
            exp_date: newTimeExp
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}
ctrl.deletePromotion = async (req, res) => {
    try {

        const { id } = req.body

        const result = await db.query(`DELETE FROM promotions WHERE id= '${id}' `)

        res.json({
            ok: true,
            msg: "Promocion eliminada"
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.addComment = async (req, res) => {
    try {

        const { target_id, user_id, comment, rate, date, market } = req.body

        let arr = []
        let rating = []
        let type = 'items'
        if (market) {
            type = 'markets'

        }


        const result = await db.query(`SELECT comments,rate FROM ${type} WHERE id = $1`, [target_id])

        if (result.rowCount === 0) {
            return res.json({
                ok: false,
                msg: 'No se encontró resultado en la búsqueda'
            })
        }

        console.log(result.rows)

        arr = result.rows[0].comments
        arr.push({
            comment,
            rate,
            user_id,
            date
        })

        rating = result.rows[0].rate
        rating.push(rate)

        const result2 = await db.query(`UPDATE ${type} SET comments = $1 WHERE id = $2 `, [arr, target_id])
        const result3 = await db.query(`UPDATE ${type} SET rate = $1 WHERE id = $2 `, [rating, target_id])


        return res.json({
            ok: true,
            msg: `El comentario se ha publicado en ${type}`
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)

    }
}

ctrl.deleteComment = async (req, res) => {
    try {
        const { target_id, user_id, market } = req.body
        let type = "items"
        if (market) type = 'markets'



        const result = await db.query(`SELECT comments FROM ${type} WHERE id = $1`, [target_id])
        if (result.rowCount === 0) {
            res.json({
                ok: true,
                msg: 'No hay comentarios que borrar'
            })
        }
        let arr = result.rows[0].comments



        arr.map((element, index) => {
            let elm = JSON.parse(element)
            if (elm.user_id === user_id) {
                arr.splice(index, 1)
            }
            return 0
        })

        const result2 = await db.query(`UPDATE ${type} SET comments = $1 WHERE id = $2`, [arr, target_id])

        res.json({
            ok: true,
            msg: `Comentario borrado de ${type}`
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.createTicket = async (req, res) => {
    try {
        const { user_id, text, title } = req.body

        const id = v4()

        const result = await db.query(`INSERT INTO tickets (id,user_id,text,title) VALUES ($1,$2,$3,$4) `, [id, user_id, text, title])

        return res.json({
            ok: true,
            msg: 'Su ticket sera evaluado por el equipo de revision.'
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.openTicket = async (req, res) => {
    try {

        const { id } = req.body

        const result = await db.query(`SELECT * FROM tickets WHERE id = $1 `, [id])

        if (result.rowCount === 0) res.json({ ok: false, msg: 'Ticket no encontrado' })

        const result2 = await db.query(`UPDATE tickets SET view = true WHERE id = $1`, [id])

        return res.json(result.rows[0])


    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}

ctrl.sendToVerifyUser = async (req, res) => {
    try {

        const { id_card, selfie, user_id, name } = req.body

        const id = v4()

        const text = `["${id_card}","${selfie}"]`

        const result = await db.query(`INSERT INTO tickets (id,user_id,title,text) VALUES ($1,$2,$3,$4) `, [id, user_id, name, text])

        return res.json({
            ok: true,
            msg: "Sus datos han sido procesados, el proceso de verificacion puede demorar de 1-2 dias"
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json(c_e_m)
    }
}


// console.log(error)
// return res.status(404).json(c_e_m)

module.exports = ctrl