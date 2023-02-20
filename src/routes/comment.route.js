const express = require('express')
const router = express.Router()

const {
  getComments,
  createComment,
  editComment,
  deleteComment
} = require('../controllers/comment.controller')
// const { getUserSchema } = require('../data/schemas')
const { verifyAdmin, verifyUser } = require('../middleware/auth.middleware')
// const { validate } = require('../middleware/validate')

router.post('/:id', createComment)
router.get('/:id', getComments)
router.patch('/edit/:id', verifyUser, verifyAdmin, editComment)
router.delete('/delete/:id', verifyUser, verifyAdmin, deleteComment)

module.exports = router
