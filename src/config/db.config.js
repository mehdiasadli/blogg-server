const { connect } = require('mongoose')

const connectToDB = () => {
  const db = process.env.DB_URI
  connect(db, () => console.log('Database connection established successfully'))
}

module.exports = { connectToDB }
