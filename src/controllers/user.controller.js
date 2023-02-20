const User = require('../models/user.model')
// const cloudinary = require('../utils/cloudinary')

const getUserByUsername = async (req, res) => {
  const { username } = req.params

  if (!username) return res.status(400).json({ msg: 'Invalid query' })

  try {
    const user = await User.findOne({ username }).select('-password').populate('collections')

    return res.status(200).json({ msg: 'User fetched successfully', data: user })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

const getAllUsers = async (_, res) => {
  try {
    const users = await User.find().select('-password')

    return res.status(200).json({ msg: 'Users fetched successfully', data: users })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server', err: error.message })
  }
}

const getUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id).select('-password')

    return res.status(200).json({ msg: 'User fetched successfully', data: user })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ msg: 'User is required' })

  const currentUser = await User.findById(req.user.id)
  if (!currentUser) return res.status(400).json({ msg: 'User not found' })

  if (Object.values(req.body).length === 0)
    return res.status(400).json({ msg: 'Nothing is updated' })
  if (Object.keys(req.body).includes('username'))
    return res.status(400).json({ msg: 'Username cannot be updated' })
  if (Object.keys(req.body).includes('password'))
    return res.status(400).json({ msg: 'Password cannot be updated' })

  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ msg: 'No user was found' })

    const updated = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password')

    return res.status(200).json({
      msg: 'User updated successfully',
      data: updated
    })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params

  if (!id) return res.status(400).json({ msg: 'User is required' })
  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ msg: 'No user was found' })

    await User.deleteOne({ id })

    return res
      .status(200)
      .json({ msg: 'User deleted successfully', data: await User.find().select('-password') })
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

// const updateImage = async (req, res) => {
//   const { username } = req.params
//   const { image } = req.body

//   try {
//     const result = await cloudinary.uploader.upload(image, {
//       folder: 'profile_images'
//     })
//     const user = await User.findOne({ username })
//     if (!user) return res.status(404).json({ message: 'No user was found' })

//     user.image = {
//       public_id: result.public_id,
//       url: result.secure_url
//     }

//     await user.save()

//     return res.status(200).json(await User.findOne({ username }).select('-password'))
//   } catch (error) {
//     return res.status(500).json({ message: 'Error occured on server' })
//   }
// }

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  getUserByUsername
  //   updateImage
}
