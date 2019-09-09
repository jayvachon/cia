const express = require('express');
const config = require('./config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const port = 8080;

passport.use(
	new GoogleStrategy({
		clientID: config.GOOGLE_CLIENT_ID,
		clientSecret: config.GOOGLE_CLIENT_SECRET,
		callbackURL: "http://localhost:8080/auth/google/callback"
	},
	(accessToken, refreshToken, profile, cb) => {
		return cb(null, profile);
	}
));

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((obj, cb) => {
	cb(null, obj);
});

const app = express();
const scopes = [
	'profile',
	'https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/gmail.readonly',
	'https://www.googleapis.com/auth/gmail.send',
];

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.render('home', { user: req.user });
});

/*app.get('/login', (req, res) => {
	res.render('login');
});*/

app.get('/failed', (req, res) => res.send('Login failed'));

// app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/spreadsheets'] }));
app.get('/login', passport.authenticate('google', { scope: scopes }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
});

app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
	res.render('profile', { user: req.user });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))