const { Schema, model } = require('mongoose')

const commentModel = new Schema(
  {
    content: { type: String, required: [true, 'Content is required'], trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' }
  },
  { timestamps: true }
)

module.exports = model('Comment', commentModel)
