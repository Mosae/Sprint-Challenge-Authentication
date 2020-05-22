const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

beforeEach(() => {
	return db.migrate
		.rollback()
		.then(() => db.migrate.latest())
		.then(() => db.seed.run());
});

test('POST /api/auth/register to be successful', async () => {
	const res = await request(server)
		.post('/api/auth/register')
		.send({ username: 'Gigi', password: 'slow' });
	expect(res.status).toBe(201); //sanity check
	expect(res.body).toHaveProperty('token');
	//console.log(res.body);
});
test('POST /api/auth/login to be successful', async () => {
	const register = await request(server)
		.post('/api/auth/register')
		.send({ username: 'Gigi', password: 'slow' });
	const res = await request(server)
		.post('/api/auth/login')
		.send({ username: 'Gigi', password: 'slow' });
	expect(res.status).toBe(201);
	expect(res.body).toMatchObject({ message: 'You are logged in!' });
	console.log(res.body);
});
