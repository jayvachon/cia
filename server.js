const {google} = require('googleapis');
const sampleClient = require('./sampleClient');
const _ = require('lodash');
const parser = require('./parser');
const templates = require('./templates');
const config = require('./config');

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

const stringToBase64 = (str) => {
	const buff = Buffer.from(str, 'utf8');
	return buff.toString('base64');
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

const makeBody = (to, from, subject, message) => {
    let str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    return stringToBase64(str).replace(/\+/g, '-').replace(/\//g, '_');;
};

const sendMessage = (raw) => {
    return gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: raw
        }
    });
};

const list = () => {
	return gmail.users.messages.list({userId: 'me', q: 'in:all subject:"Get in touch" OR subject:"New Entry: New Candidate"'})
		.then(list => {
			return _.map(list.data.messages, m => m.id);
		})
		.then(ids => getMessages(ids))
		.then(messages => extractBody(messages))
		.then(bodies => {

			// Find new entries and pull out the important data
			let entries = _.map(bodies, body => {
				return {
					id: body.id,
					content: parser.extract(body.content[0]),
				};
			});
			// console.log(entries);

			return _.filter(entries, entry => entry.content.email !== undefined);
		})
		.then(entries => {

			// Do not proceed for emails that have already been processed (this is tracked by the 'id' field)
			return sheets.spreadsheets.values.get({
				spreadsheetId: config.SPREADSHEET_ID,
				range: 'GIT!B:B',
			})
			.then(emails => {
				let allEmails = _.flatten(emails.data.values);
				return _.filter(entries, entry => !_.includes(allEmails, entry.content.email));
			});
		})
		.then(entries => {
			
			console.log(`Added ${entries.length} new contacts`);

			return Promise.all(_.map(entries, entry => {
				return sheets.spreadsheets.values.append({
					 spreadsheetId: config.SPREADSHEET_ID,
					 range: "GIT!A1:J1",
					 insertDataOption: "INSERT_ROWS",
					 valueInputOption: "RAW",
					 resource: {
					 	majorDimension: "ROWS",
					 	values: [
					 		[
					 			entry.id,
					 			entry.content.email,
					 			entry.content.phone,
					 			entry.content.firstName,
					 			entry.content.lastName,
					 			entry.content.status,
					 			entry.content.aid,
					 			'Winter 2020',
					 			entry.content.program,
					 			entry.content.message,
					 			new Date(),
							]
					 	]
				 	}
				});
			}));
			
		})
		.then(appended => {
			return Promise.all(_.each(appended, contact => {
					let values = JSON.parse(contact.config.body).values[0];
					let email = values[1];
					let firstName = values[3];
					let program = values[8];
					let body = templates.initial(firstName, program, 'January');
					let raw = makeBody(email, 'admissions@codeimmersives.com', 'RE: Code Immersives NYC', body)
					return sendMessage(raw);
				})
			);
		})
		.then(sent => {
			console.log(sent);
		})
		.catch(err => console.error(err));
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
	base64ToString,
	stringToBase64,
	makeBody,
	sendMessage,
	client: sampleClient.oAuth2Client,
};