const { Schema, model } = require('mongoose')

const collectionModel = new Schema(
  {
    name: { type: String, required: [true, 'Collection name is required'], trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]
  },
  { timestamps: true }
)

module.exports = model('Collection', collectionModel)
