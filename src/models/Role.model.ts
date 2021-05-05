import { Schema, Model, Document, model, Types, Query } from 'mongoose';

export interface RoleInterface {
  name: string;
}

export interface RoleBaseDocument extends RoleInterface, Document {}

// Export this for strong typing
export interface RoleDocument extends RoleBaseDocument {}

// For model
export interface RoleModel extends Model<RoleBaseDocument> {}

const roleModel = new Schema<RoleDocument, RoleModel>({
  name: {
    type: String,
    required: [true, 'Please enter role name'],
    minlength: [4, 'Minimum length of role name is 4 characters'],
  },
});

// fire a function before doc saved to db
// userSchema.pre('save', async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// static method to login user
// userSchema.statics.login = async (username, password) => {
//   const user = await this.findOne({ username });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error('incorrect password');
//   }
//   throw Error('incorrect email');
// };

export default model<RoleDocument, RoleModel>('Role', roleModel);
