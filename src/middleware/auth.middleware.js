const jwt = require('jsonwebtoken')
const { ROLES } = require('../data')
const User = require('../models/user.model')

const config = process.env

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) return res.status(403).json({ msg: 'Unauthorized', code: 9000 })

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY)
    req.user = decoded
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid Token', err, code: 9001 })
  }

  return next()
}

const verifyAdmin = async (req, res, next) => {
  if (req.nextMiddleware === 'skip') return next()

  if (!req.user.roles.includes(ROLES.admin))
    return res.status(403).json({ msg: 'Unauthorized', code: 9000 })

  return next()
}

const verifyUser = async (req, res, next) => {
  const { id } = req.params

  console.log(id)
  try {
    const user = await User.findById(id)
    if (!user) return res.status(400).json({ msg: 'User not found' })

    if (req.user.username !== user.username)
      return res.status(403).json({ msg: 'Unauthorizeed', code: 9000 })

    req.nextMiddleware = 'skip'
    next()
  } catch (error) {
    return res.status(500).json({ msg: 'Error occured on server' })
  }
}

module.exports = { verifyToken, verifyAdmin, verifyUser }
