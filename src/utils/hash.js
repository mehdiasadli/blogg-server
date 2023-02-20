const bcrypt = require('bcryptjs')

module.exports = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}
