import mongoose from 'mongoose'

const pageSchema = new mongoose.Schema({
  title: String,
  className: String,
  route: { type: String, required: true, unique: true },
  navOrder: Number,
  omitDefaultHeader: Boolean,
  omitDefaultFooter: Boolean,

  // This will be JSON
  sections: [String],
  css: String,

  created: { type: Date, default: Date.now },
})

export default mongoose.models.page ||
  mongoose.model('page', pageSchema)
