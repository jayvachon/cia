require('should');
const parser = require('../parser');
const appRoot = require('app-root-path');
const fs = require('mz/fs');

describe('Parser', () => {

	it('should extract "get in touch" email information', done => {
		const sample = fs.readFile(`${appRoot}/samples/get_in_touch.html`, 'utf8')
			.then(html => {
				let extraction = parser.extract(html);
				console.log(extraction);
				extraction.should.be.type('object');
				done();
			});
	});

	it('should extract "Contact Us Form" email information', done => {
		const sample = fs.readFile(`${appRoot}/samples/contact_us_form.html`, 'utf8')
			.then(html => {
				let extraction = parser.extract(html);
				console.log(extraction);
				extraction.should.be.type('object');
				done();
			});
	});

	it('should extract new entry: new candidate email information', done => {
		const sample = fs.readFile(`${appRoot}/samples/new_entry_new_candidate.html`, 'utf8')
			.then(html => {
				let extraction = parser.extract(html);
				extraction.should.be.type('object');
				done();
			});
	});

	it('should read table', done => {
		const sample = fs.readFile(`${appRoot}/samples/table.html`, 'utf8')
			.then(html => {
				let data = parser.readTable(html);
				data.should.be.type('object');
				done();
			});
	});
});