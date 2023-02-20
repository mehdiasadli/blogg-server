const express = require('express')
const cors = require('cors')

require('dotenv').config()

const { connectToDB } = require('./src/config/db.config')
const { PORT_NUMBER, paths } = require('./src/data')
const { verifyToken } = require('./src/middleware/auth.middleware')

// Init. express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to the Database
connectToDB()

// Routes
app.use(paths.auth, require('./src/routes/auth.route'))
app.use(paths.user, verifyToken, require('./src/routes/user.route'))
app.use(paths.coll, verifyToken, require('./src/routes/collection.route'))
app.use(paths.blog, verifyToken, require('./src/routes/blog.route'))
app.use(paths.comm, verifyToken, require('./src/routes/comment.route'))

app.use(paths[404], (_, res) => res.send('404: NOT FOUND!'))

// Listen the server
const port = process.env.PORT || PORT_NUMBER
app.listen(port, () => console.log('Listening on Port: ' + port))

// Export app for vercel
module.exports = app
