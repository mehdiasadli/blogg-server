const express = require('express')
const router = express.Router()

const { signin, signup } = require('../controllers/auth.controller')
const { validate } = require('../middleware/validate')
const { signinSchema, signupSchema } = require('../data/schemas')

router.post('/signin', validate(signinSchema), signin)
router.post('/signup', validate(signupSchema), signup)

module.exports = router
