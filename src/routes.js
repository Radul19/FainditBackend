const { Router } = require("express")
const { home, register } = require('./controller')


// const multer = require("multer")
// const itemStorageConfig = multer.diskStorage({

//     destination: (req, file, cb) => {
//         cb(null, "./public/uploads")
//     },

//     filename: (req, file, cb) => {
//         cb(null, "img--" + file.originalname)
//     }
// })

// const uploadItem = multer({ storage: itemStorageConfig })

const router = Router()



router.get('/', home)

router.post('/register', register)

module.exports = router