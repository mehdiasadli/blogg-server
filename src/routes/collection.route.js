const express = require('express')
const router = express.Router()

const {
  getCollection,
  getCollections,
  createCollection,
  editCollection,
  deleteCollection
} = require('../controllers/collection.controller')
// const { getUserSchema } = require('../data/schemas')
const { verifyAdmin, verifyUser } = require('../middleware/auth.middleware')
// const { validate } = require('../middleware/validate')

router.post('/', createCollection)
router.get('/user/:id', getCollections)
router.get('/:id', getCollection)
router.patch('/edit/:id', verifyUser, verifyAdmin, editCollection)
router.delete('/delete/:id', deleteCollection)

module.exports = router
