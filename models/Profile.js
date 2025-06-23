const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  socialLinks: {
    twitter: String,
    github: String,
    linkedin: String
  },
  technologies: [{
    type: String
  }],
  heroImage: {
    type: String,
    default: 'https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema); 