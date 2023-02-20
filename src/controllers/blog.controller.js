const Blog = require('../models/blog.model')
const User = require('../models/user.model')
const Collection = require('../models/collection.model')

const getAllBlogs = async (req, res) => {
  const BLOG_LIMIT = 12
  let { page } = req.query

  if (!page || page === 'null') page = 1
  else page = Number(page)
  if (isNaN(page)) return res.status(400).json({ message: 'Invalid page query param' })

  const skip = BLOG_LIMIT * (page - 1)

  try {
    const data = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(BLOG_LIMIT)
      .populate('author', { username: 1 })
      .populate('collectionName', { name: 1 })

    const total = await Blog.find().countDocuments()

    return res.status(200).json({
      msg: 'Blogs fetched successfully',
      total: Math.ceil(total / BLOG_LIMIT),
      all: total,
      page,
      isLast: skip + BLOG_LIMIT >= total,
      limit: BLOG_LIMIT,
      onePage: skip + BLOG_LIMIT >= total && page === 1,
      data
    })
  } catch (err) {
    return res.status(500).json({ msg: 'Error occured on server', err: err.message })
  }
}

const getUsersBlogs = async (req, res) => {
  const BLOG_LIMIT = 9

  const { id } = req.params // userId
  let { page } = req.query

  if (!page) page = 1
  else page = Number(page)
  if (isNaN(page)) return res.status(400).json({ message: 'Invalid page query param' })

  const skip = BLOG_LIMIT * (page - 1)

  try {
    const data = await Blog.find({ author: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(BLOG_LIMIT)
      .populate('collectionName', { name: 1 })

    const total = await Blog.find({ author: id }).countDocuments()

    return res.status(200).json({
      msg: 'Blogs fetched successfully',
      total: Math.ceil(total / BLOG_LIMIT),
      all: total,
      page,
      isLast: skip + BLOG_LIMIT >= total,
      limit: BLOG_LIMIT,
      onePage: skip + BLOG_LIMIT >= total && page === 1,
      data
    })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server', err: error.message })
  }
}

const getBlogs = async (req, res) => {
  const BLOG_LIMIT = 12
  const { id } = req.params // collectionId
  let { page } = req.query

  if (!page || page === 'null') page = 1
  else page = Number(page)
  if (isNaN(page)) return res.status(400).json({ message: 'Invalid page query param' })

  const skip = BLOG_LIMIT * (page - 1)

  try {
    const data = await Blog.find({ collectionName: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(BLOG_LIMIT)
      .populate('author', { username: 1 })
      .populate('collectionName', { name: 1 })

    const total = await Blog.find({ collectionName: id }).countDocuments()

    const collection = await Collection.findById(id).select('name')

    return res.status(200).json({
      msg: 'Blogs fetched successfully',
      data,
      total: Math.ceil(total / BLOG_LIMIT),
      all: total,
      page,
      isLast: skip + BLOG_LIMIT >= total,
      limit: BLOG_LIMIT,
      collection,
      onePage: skip + BLOG_LIMIT >= total && page === 1
    })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server', err: error.message })
  }
}
const getBlog = async (req, res) => {
  const { id } = req.params // blogId

  try {
    const data = await Blog.findById(id)
      .select('-updatedAt')
      .populate('author', { username: 1, firstName: 1, lastName: 1 })
      .populate('collectionName', { name: 1 })

    return res.status(200).json({ msg: 'Blog fetched successfully', data })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server', err: error.message })
  }
}

const createBlog = async (req, res) => {
  const { id } = req.params // collectionId
  const { title, content } = req.body

  if (id == 'null') return res.status(400).json({ msg: 'Collection is required' })

  try {
    const newBlog = new Blog({
      title,
      content,
      author: req.user.id,
      collectionName: id || newCollection._id
    })
    await newBlog.save()

    const collection = await Collection.findById(id || newCollection._id)
    collection.blogs.push(newBlog._id)
    collection.save()

    return res.json({ msg: 'Blog saved successfully', data: newBlog })
  } catch (err) {
    return res.status(500).json({ msg: 'Server error occured', err: err.message, code: 5000 })
  }
}

const editBlog = async (req, res) => {
  const { id } = req.params // blogId
  if (!id) return res.status(400).json({ msg: 'Blog is required' })

  if (Object.values(req.body).length === 0)
    return res.status(400).json({ msg: 'Nothing is updated' })

  try {
    const blog = await Blog.findById(id)
    if (!blog) return res.status(404).json({ msg: 'No Blog was found' })

    const updated = await Blog.findByIdAndUpdate(id, req.body, { new: true })

    return res.status(200).json({
      msg: 'Blog updated successfully',
      data: updated
    })
  } catch (err) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

const deleteBlog = async (req, res) => {
  const { id } = req.params // blogId
  if (!id) return res.status(400).json({ msg: 'Blog is required' })

  try {
    const blog = await Blog.findById(id)
    if (!blog) return res.status(404).json({ msg: 'No Blog was found' })

    await Blog.deleteOne({ _id: id })
    const collection = await Collection.findById(blog.collectionName)
    collection.blogs = collection.blogs.filter((item) => item._id != id)
    collection.save()

    return res.status(200).json({ msg: 'Blog deleted successfully', data: await Blog.find() })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  editBlog,
  getUsersBlogs,
  deleteBlog,
  getAllBlogs
}
