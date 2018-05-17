import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export let Schema = mongoose.Schema;

export interface IUserModel extends mongoose.Document {
  name: string;
  password: string;
}

const schema = new Schema({
  name: {
	   type: String,
	   required: true
  },
  password: {
	  type: String
  }
}).pre('save', async function(next) {
	const user = this as IUserModel;
	if (user.isModified('password') || user.isNew) {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(user.password, salt);
			user.password = hash;
		} catch (error) {
			console.error(error);
		}
	}
  	next();
});

export const User = mongoose.model<IUserModel>('user', schema, 'users');