import { model, Schema } from 'mongoose';
import { User } from '../utils/interface';

const userSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = model<User>('User', userSchema);

export default UserModel;
