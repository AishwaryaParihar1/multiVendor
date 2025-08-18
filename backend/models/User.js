const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },

  // Vendor specific fields
  businessName: {
    type: String,
    required: function() {
      return this.role === 'vendor';
    }
  },
  businessAddress: {
    type: String,
  },
  phone: {
    type: String
  },
  profileImage: {
    type: String // Cloudinary URL or local
  },
  vendorStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // Only for vendor approval flow
  },

  // Common fields
  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
