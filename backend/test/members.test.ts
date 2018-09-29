import 'jest';
import Server from '../src/server';
import * as supertest from 'supertest';
import { generateUsers } from '../src/utils/helper';
import { IMemberModel } from '../src/models/member';

let server: Server;
let request: supertest.SuperTest<supertest.Test>;
let members: { user: IMemberModel; token: string }[];
let user: { user: IMemberModel; token: string };

describe('Suite: /api/members', () => {
	beforeAll(() =>
		Server.createInstance()
			.then(s => (server = s))
			.then(s => (request = supertest(s.app))));

	beforeEach(async () => {
		members = await Promise.all<{ user: IMemberModel; token: string }>(
			generateUsers(6).map(u =>
				request
					.post('/api/auth/signup')
					.send(u)
					.then(response => response.body.response)
			)
		);
		user = members[0];
	});

	describe('Get all Users', () => {
		it('Successfully gets all users', async () => {
			const {
				body: { response },
				status
			} = await request.get('/api/members');
			expect(status).toEqual(200);
			expect(response.members).toHaveLength(members.length);
			response.members.forEach(u => {
				expect(u).not.toHaveProperty('password');
				expect(u).toHaveProperty('_id');
				const foundUser = members.find(val => val.user._id === u._id);
				expect(foundUser).toBeTruthy();
				expect(u.name).toEqual(foundUser.user.name);
				expect(u.graduationYear).toEqual(foundUser.user.graduationYear);
			});
		});
	});

	describe('Get a single Users', () => {
		it('Fails to get a single user because invalid id', async () => {
			const {
				body: { error },
				status
			} = await request.get('/api/members/invalidID');
			expect(status).toEqual(400);
			expect(error).toEqual('Invalid member ID');
		});

		it('Fails to get a single user because user does not exist', async () => {
			const {
				body: { error },
				status
			} = await request.get(
				`/api/members/${server.mongoose.Types.ObjectId()}`
			);
			expect(status).toEqual(400);
			expect(error).toEqual('Member does not exist');
		});

		it('Successfully gets a single user', async () => {
			const {
				body: { response },
				status
			} = await request.get(`/api/members/${user.user._id}`);
			expect(status).toEqual(200);
			expect(response).toEqual(user.user);
		});
	});

	afterEach(() => server.mongoose.connection.dropDatabase());

	afterAll(() => server.mongoose.disconnect());
});
