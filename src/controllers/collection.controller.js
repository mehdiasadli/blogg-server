const Collection = require('../models/collection.model')
const User = require('../models/user.model')

const getCollections = async (req, res) => {
  const LIMIT = 9

  const { id } = req.params // userId
  let { page } = req.query

  if (!page || page === 'null') page = 1
  else page = Number(page)
  if (isNaN(page)) return res.status(400).json({ message: 'Invalid page query param' })

  const skip = LIMIT * (page - 1)
  try {
    const collections = await Collection.find({ owner: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(LIMIT)
      .populate('owner', { username: 1 })

    const total = await Collection.find({ owner: id }).countDocuments()

    return res.status(200).json({
      msg: 'Collections fetched successfully',
      data: collections,
      total: Math.ceil(total / LIMIT),
      all: total,
      page,
      isLast: skip + LIMIT >= total,
      limit: LIMIT,
      onePage: skip + LIMIT >= total && page === 1
    })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server', err: error.message })
  }
}

const getCollection = async (req, res) => {
  const { id } = req.params // collectionId

  try {
    const collection = await Collection.findById(id)

    return res.status(200).json({ msg: 'Collection fetched successfully', data: collection })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server', err: error.message })
  }
}

const createCollection = async (req, res) => {
  const { name } = req.body

  try {
    const newCollection = new Collection({ name, owner: req.user.id })
    await newCollection.save()

    const user = await User.findById(req.user.id)
    user.collections.push(newCollection._id)
    user.save()

    return res.json({ msg: 'Collection saved successfully', data: newCollection })
  } catch (err) {
    return res.status(500).json({ msg: 'Server error occured', err: err.message, code: 5000 })
  }
}

const editCollection = async (req, res) => {
  const { id } = req.params // collectionId
  if (!id) return res.status(400).json({ msg: 'Collection is required' })

  if (Object.values(req.body).length === 0)
    return res.status(400).json({ msg: 'Nothing is updated' })

  try {
    const collection = await Collection.findById(id)
    if (!collection) return res.status(404).json({ msg: 'No Collection was found' })

    const updated = await Collection.findByIdAndUpdate(id, req.body, { new: true })

    return res.status(200).json({
      msg: 'Collection updated successfully',
      data: updated
    })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

const deleteCollection = async (req, res) => {
  const { id } = req.params // collectionId
  if (!id) return res.status(400).json({ msg: 'Collection is required' })

  try {
    const collection = await Collection.findById(id)
    if (!collection) return res.status(404).json({ msg: 'No Collection was found' })

    await Collection.deleteOne({ id })
    const user = await User.findById(req.user.id)
    user.collections = user.collections.filter((item) => item._id != id)
    user.save()

    return res
      .status(200)
      .json({ msg: 'Collection deleted successfully', data: await Collection.find() })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

module.exports = {
  getCollections,
  getCollection,
  createCollection,
  editCollection,
  deleteCollection
}
