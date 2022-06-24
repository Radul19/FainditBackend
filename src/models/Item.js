const { Schema, model } = require('mongoose')

const ItemSchema = new Schema({
    marketId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: false },
    tags: { type: Array, required: false },
    stadistics: { type: Array, required: false },
    rate: { type: Number, required: true },
    comments: { type: Array, required: false },
    image: { type: String, required: true },
})


module.exports = model('Item', ItemSchema)