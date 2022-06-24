// // Connect to MongoDB

// const mongoose = require('mongoose')

// // direccion con acceso a la base de datos de MongoDB 
// mongoose.connect('mongodb+srv://user:comicseries123456@comicseries.6fy7c.mongodb.net/comicseries', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(db => console.log('Database is connected'))
//     .catch(err => console.log(err))

const {Pool} = require("pg")

///Configuracion para Pool de Postgresql

// const config = {
//     user: 'postgres',
//     host: 'localhost',
//     password: "123123",
//     database: 'fainditdb',
//     port:'5432',
// }

const config = {
    user: 'fcqevrrgrntfim',
    host: 'ec2-18-204-142-254.compute-1.amazonaws.com',
    password: "1091dee2e18ee74a8f2fe825206be280d52ef386f6510fea4447137f58978a13",
    database: 'd8b4f0ctpup4pm',
    port:'5432',
    ssl: {
    rejectUnauthorized: false,
  },
}

const pool = new Pool(config)

module.exports = pool