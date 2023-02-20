const User = require('../models/user.model')

const hashPassword = require('../utils/hash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const signup = async (req, res) => {
  const { firstName, lastName, username, password } = req.body

  try {
    const data = {
      firstName,
      lastName,
      username,
      password: await hashPassword(password)
    }

    const hasUserWithUsername = await User.findOne({ username: data.username })
    if (hasUserWithUsername)
      return res.status(400).json({ msg: 'Username is already in use', code: 1010 })

    const newUser = new User(data)
    await newUser.save()

    return res.json({ msg: 'User saved successfully', data: newUser })
  } catch (err) {
    return res.status(500).json({ msg: 'Server error occured', err: err.message, code: 5000 })
  }
}

const signin = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user) return res.status(400).json({ message: 'Invalid Username or Password', code: 1009 })

    const passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare)
      return res.status(400).json({ message: 'Invalid Username or Password', code: 1011 })

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET_KEY
    )

    const response = {
      ...user._doc,
      token,
      password: undefined
    }

    return res.json({ msg: 'User Logged in Succesfully', data: response })
  } catch (error) {
    return res.status(500).json({ msg: 'Server error occured', code: 5000, err: error.message })
  }
}

module.exports = { signin, signup }
