import { Schema, Model, Document, model } from 'mongoose';

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
    unique: true,
    required: [true, 'Please enter role name'],
    minlength: [4, 'Minimum length of role name is 4 characters'],
  },
});

export default model<RoleDocument, RoleModel>('Role', roleModel);
