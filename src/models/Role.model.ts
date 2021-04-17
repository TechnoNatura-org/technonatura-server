// const mongoose = require('mongoose');
// // const {
// //   default: { isEmail },
// // } = require('validator');
// // const bcrypt = require('bcrypt');

// // const path = require('path');
// // const coverImageBasePath = 'uploads/bookCovers';

// const roleModel = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please enter role name'],
//     minlength: [4, 'Minimum length of role name is 4 characters'],
//   },
//   users: [String],
// });

// // fire a function before doc saved to db
// // userSchema.pre('save', async function (next) {
// //   const salt = await bcrypt.genSalt();
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// // });

// // static method to login user
// // userSchema.statics.login = async (username, password) => {
// //   const user = await this.findOne({ username });
// //   if (user) {
// //     const auth = await bcrypt.compare(password, user.password);
// //     if (auth) {
// //       return user;
// //     }
// //     throw Error('incorrect password');
// //   }
// //   throw Error('incorrect email');
// // };

// module.exports = mongoose.model('Role', roleModel);
