import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({

  created: { type: Date, default: Date.now },

  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  notes: String,
  shipped: { type: Boolean, default: false }
})

export default mongoose.models.order || mongoose.model('order', orderSchema)
