require('should');
const server = require('../server');

describe('Gmail', () => {

	it('should convert utf8 string to base64 string', done => {
		let base64 = server.stringToBase64('hello world');
		base64.should.eql('aGVsbG8gd29ybGQ=');
		done();
	});

	it('should convert base64 string to utf8 string', done => {
		let str = server.base64ToString('aGVsbG8gd29ybGQ=');
		str.should.eql('hello world');
		done();
	});

	it('should create email body', done => {
		let body = server.makeBody('admissions@codeimmersives.com', 'admissions@codeimmersives.com', 'test subject', 'test message');
		body.should.eql('Q29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PSJVVEYtOCIKTUlNRS1WZXJzaW9uOiAxLjAKQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogN2JpdAp0bzogYWRtaXNzaW9uc0Bjb2RlaW1tZXJzaXZlcy5jb20KZnJvbTogYWRtaXNzaW9uc0Bjb2RlaW1tZXJzaXZlcy5jb20Kc3ViamVjdDogdGVzdCBzdWJqZWN0Cgp0ZXN0IG1lc3NhZ2U=');
		done();
	});

	/*it('should send email', done => {
		let body = server.makeBody('admissions@codeimmersives.com', 'admissions@codeimmersives.com', 'test subject', 'test message');
		server.sendMessage(body)
			.then(msg => {
				console.log(msg);
				done();
			});
	});*/
});