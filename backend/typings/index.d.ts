import { IMemberModel } from '../models/member';

declare global {
	namespace Express {
		interface User extends IMemberModel {}
	}
}
