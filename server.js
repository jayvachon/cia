const {google} = require('googleapis');
const sampleClient = require('./sampleClient');
const _ = require('lodash');

const gmail = google.gmail({
	version: 'v1',
	auth: sampleClient.oAuth2Client,
});

const base64ToString = (base64str) => {
	if (!base64str) return '';
	const buff = Buffer.from(base64str, 'base64');
	return buff.toString('utf8');
};

/*async function list() {
	const res = await gmail.users.messages.list({userId: 'me'});
	console.log(res.data);
	// gmail.message.
	gmail.users.messages.get({
		'userId': 'me',
		'id': '16cfd13842472c2c'
	})
	.then(msg => {
		console.log(JSON.stringify(msg.data.payload.parts, null, 4));

		let parts = msg.data.payload.parts;
		console.log(_.map(parts, p => {
			return base64ToString(p.body.data);
		}));
	});
	return res.data;
}*/

const list = () => {
	return gmail.users.messages.list({userId: 'me', q: 'from:admissions@codeimmersives.com is:unread'})
		.then(list => {
			return _.map(list.data.messages, m => m.id);
		})
		.then(ids => getMessages(ids))
		.then(messages => extractBody(messages))
		.then(bodies => {
			console.log(bodies);
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

				console.log(message);
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