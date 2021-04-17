// const mongoose = require('mongoose');
// // const path = require('path');
// // const coverImageBasePath = 'uploads/bookCovers';

// const blogPostSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title Cannot Be Blank'],
//   },
//   content: {
//     type: String,
//     required: [true, 'Please Fill Content'],
//   },
//   publishDate: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
//   thumbnail: {
//     type: String,
//     required: true,
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'User',
//   },
// });

// module.exports = mongoose.model('BlogPost', blogPostSchema);
