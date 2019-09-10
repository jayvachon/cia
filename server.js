const {google} = require('googleapis');
const sampleClient = require('./sampleClient');
const _ = require('lodash');
const parser = require('./parser');
const templates = require('./templates');

const gmail = google.gmail({
	version: 'v1',
	auth: sampleClient.oAuth2Client,
});

const sheets = google.sheets({
	version: 'v4',
	auth: sampleClient.oAuth2Client,
});

const base64ToString = (base64str) => {
	if (!base64str) return '';
	const buff = Buffer.from(base64str, 'base64');
	return buff.toString('utf8');
};

const list = () => {
	return gmail.users.messages.list({userId: 'me', q: 'from:admissions@codeimmersives.com is:unread'})
		.then(list => {
			return _.map(list.data.messages, m => m.id);
		})
		.then(ids => getMessages(ids))
		.then(messages => extractBody(messages))
		.then(bodies => {

			// Find new entries and pull out the important data
			let entries = _.map(bodies, body => parser.extract(body.content[0]));
			return _.filter(entries, entry => entry.Name !== undefined);
		})
		.then(entries => {
			console.log(entries);

			return sheets.spreadsheets.values.append({
				 spreadsheetId: "15HPGz57OYdRLj-1WGSsHOUXzfCim4ORreS2ziKmrb-M",
				 range: "Sheet1!A1:J41",
				 insertDataOption: "INSERT_ROWS",
				 valueInputOption: "RAW",
				 resource: {
				 	majorDimension: "ROWS",
				 	values: [
				 		[
							"email",
							"phone",
							"first name",
							"last name",
							"student type",
							"term",
							"program",
							"last correspondance",
							"date corresponded",
							"notes",
						]
				 	]
			 	}
			});
		})
		.then(appended => {
			console.log(appended);
		});
};

const getMessages = (ids) => {
	return Promise.all(_.map(ids, id => {
		return gmail.users.messages.get({
			id: id,
			userId: 'me',
			format: 'full',
		});
	}))
};

const extractBody = (messages) => {
	return new Promise((resolve, reject) => {
		return resolve(
			_.map(messages, message => {

				if (message.data.payload.parts) {
					let parts = message.data.payload.parts;
					return {
						id: message.data.id,
						content: _.map(parts, part => {
							return base64ToString(part.body.data);
						}),
					}
				} else {
					return { 
						id: message.data.id,
						content: [base64ToString(message.data.payload.body.data)],
					};
				}
			})
		)
	});
};

if (module === require.main) {
	const scopes = [
		'https://www.googleapis.com/auth/spreadsheets',
		'https://www.googleapis.com/auth/gmail.readonly',
		'https://www.googleapis.com/auth/gmail.send',
	];
	sampleClient
		.authenticate(scopes)
		.then(list)
		.catch(console.error);
}

module.exports = {
	list,
	client: sampleClient.oAuth2Client,
};