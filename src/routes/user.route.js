const express = require('express')
const router = express.Router()

const { getAllUsers, getUserByUsername, deleteUser, updateUser, getUser } = require('../controllers/user.controller')
const { getUserSchema } = require('../data/schemas')
const { verifyAdmin, verifyUser } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate')

router.get('/', getAllUsers)
router.get('/:username', getUserByUsername)
router.get('/:id', validate(getUserSchema), getUser)
router.patch('/edit/:id', validate(getUserSchema), updateUser)
router.delete('/delete/:id', validate(getUserSchema), verifyUser, verifyAdmin, deleteUser)
// router.patch(
//   '/edit/image/:id',
//   validate(editImageSchema),
//   verifyUser,
//   verifyAdmin,
//   updateImage
// )

module.exports = router
