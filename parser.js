const cheerio = require('cheerio');
const _ = require('lodash');

const extract = (html) => {
	const $ = cheerio.load(html);
	const tables = $('.mcnTextContentContainer > tbody > tr > td').children('table');
	let form = {};
	_.forEach(tables, table => _.assign(form, readTable(table)));
	return form;
};

const readTable = (table) => {
	
	const $ = cheerio.load(table);
	const content = {};
	
	$('tbody').children('tr').each((i, elem) => {
		let text = $(elem).children().first().text();
		if (i === 0) {
			content.key = text;
		} else if (i === 1) {
			content.value = text;
		}
	});

	return {[content.key]: content.value};
};

module.exports = {
	extract,
	readTable,
};