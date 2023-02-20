const express = require('express')
const router = express.Router()

const {
  getBlog,
  getBlogs,
  createBlog,
  editBlog,
  getUsersBlogs,
  deleteBlog,
  getAllBlogs
} = require('../controllers/blog.controller')
const { createBlogSchema } = require('../data/schemas')
const { verifyAdmin, verifyUser } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate')

router.get('/all', getAllBlogs)
router.post('/:id', validate(createBlogSchema), createBlog)
router.get('/:id', getBlog)
router.get('/collection/:id', getBlogs)
router.get('/user/:id', getUsersBlogs)
router.patch('/edit/:id', editBlog)
router.delete('/delete/:id', deleteBlog)

module.exports = router
