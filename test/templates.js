require('should');
const templates = require('../templates');

describe('Templates', () => {

	it('should build initial email template', done => {
		const email = templates.initial('Jay', 'Javascript - Web Development', 'January');
		email.should.be.type('string');
		done();
	});
});