const { Schema, model } = require('mongoose')

const blogModel = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    content: { type: String, required: [true, 'Content is required'], trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    collectionName: { type: Schema.Types.ObjectId, ref: 'Collection' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  },
  { timestamps: true }
)

module.exports = model('Blog', blogModel)
