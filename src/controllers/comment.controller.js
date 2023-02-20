const Blog = require('../models/blog.model')
const User = require('../models/user.model')
const Comment = require('../models/comment.model')

const getComments = async (req, res) => {
  const { id } = req.params // blogId

  try {
    const data = await Comment.find({ blog: id })

    return res.status(200).json({ msg: 'Comments fetched successfully', data })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server', err: error.message })
  }
}

const createComment = async (req, res) => {
  const { id } = req.params // blogId
  const { content } = req.body

  try {
    const newComment = new User({ content, user: req.user.id, blog: id })
    await newComment.save()

    const blog = await Blog.findById(id)
    blog.blogs.push(newComment._id)
    blog.save()

    return res.json({ msg: 'Comment saved successfully', data: newComment })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error occured', err: err.message, code: 5000 })
  }
}

const editComment = async (req, res) => {
  const { id } = req.params // commentId
  if (!id) return res.status(400).json({ msg: 'Comment is required' })

  if (Object.values(req.body).length === 0)
    return res.status(400).json({ msg: 'Nothing is updated' })

  try {
    const comment = await Comment.findById(id)
    if (!comment) return res.status(404).json({ msg: 'No Comment was found' })

    const updated = await Comment.findByIdAndUpdate(id, req.body, { new: true })

    return res.status(200).json({
      msg: 'Comment updated successfully',
      data: updated
    })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

const deleteComment = async (req, res) => {
  const { id } = req.params // commentId
  if (!id) return res.status(400).json({ msg: 'Comment is required' })

  try {
    const comment = await Comment.findById(id)
    if (!comment) return res.status(404).json({ msg: 'No Comment was found' })

    await Comment.deleteOne({ id })
    const blog = await Blog.findById(comment.blog)
    blog.comments = blog.comments.filter((item) => item._id != id)
    blog.save()

    return res.status(200).json({ msg: 'Comment deleted successfully', data: await Comment.find() })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

module.exports = {
  getComments,
  createComment,
  editComment,
  deleteComment
}
