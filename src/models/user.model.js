const { Schema, model } = require('mongoose')
const { ROLES } = require('../data')

const userModel = new Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username already in use'],
      trim: true
    },
    password: { type: String, required: [true, 'Password is required'], trim: true },
    role: { type: [String], default: [ROLES.member], enum: Object.values(ROLES) },
    collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
    image: {
      public_id: String,
      url: String
    }
  },
  { timestamps: true }
)

module.exports = model('User', userModel)
