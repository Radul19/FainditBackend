const { Router } = require("express")
const { home, register, login, createItem, search, getid, getItemById, createMarket, getMarket, toggleFavorite, deleteItem, deleteMarket, addSubCategory, deleteSubCategory, getUsers,
    addInterest, deleteInterest, getUserById, getMarkets, getItems, addPromotion, deletePromotion, getPromotions, addComment, deleteComment, createTicket, getTickets,
    openTicket, sendToVerifyUser } = require('./controller')


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

/// GETTERS
router.get('/getUsers', getUsers)
router.get('/getMarkets', getMarkets)
router.get('/getItems', getItems)
router.get('/getItem/:id', getItemById)
router.get('/getUser/:id', getUserById)
router.get('/getMarket/:id', getMarket)
router.get('/getPromotions', getPromotions)
router.get('/getTickets', getTickets)

//// 1ST BLOCK

router.get('/', home)

router.get('/uuid', getid)

router.post('/register', register)

router.post('/login', login)

router.post('/createItem', createItem)

router.post('/deleteItem', deleteItem)

router.post('/createMarket', createMarket)

router.post('/search', search)


router.post('/deleteMarket', deleteMarket)

router.post('/toggleFavorite', toggleFavorite)

router.post('/addSubCategory', addSubCategory)
router.post('/deleteSubCategory', deleteSubCategory)

router.post('/addInterest', addInterest)
router.post('/deleteInterest', deleteInterest)

///// 2ND BLOCK

router.post('/addPromotion', addPromotion)
router.post('/deletePromotion', deletePromotion)
router.post('/addComment', addComment)
router.post('/deleteComment', deleteComment)

router.post('/createTicket', createTicket)
router.post('/openTicket', openTicket)
router.post('/userVerify', sendToVerifyUser)



module.exports = router