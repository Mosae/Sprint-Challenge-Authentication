exports.seed = function (knex) {
	// 000-cleanup.js already cleaned out all tables

	const users = [
		{
			username: 'Mosae',
			password: 'Now',
			id: 12,
		},
	];

	return knex('users').insert(users);
};
