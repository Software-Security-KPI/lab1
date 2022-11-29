const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // try to get the token from the Authorization header
	const token = req.headers.authorization?.split(' ')[1];

	if (token) {
		try {
            // check token for validity
			const claims = jwt.verify(token, process.env.JWT_SECRET_KEY);

			return res.json({
				username: claims.username, // extract username from claims
				logout: 'http://localhost:3000/logout',
			});
		} catch (err) {
            res.status(401).send('invalid token');
		}
	}

	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logout', (req, res) => {
	res.redirect('/');
});

const users = [
	{
		login: 'john74',
		password: '123456',
		username: 'John'
	},
	{
		login: 'dmytr0',
		password: '111111',
		username: 'Dmytro'
	}
];

app.post('/api/login', (req, res) => {
	const { login, password } = req.body;

	const user = users.find(user => user.login == login && user.password == password);

    // in case creds are valid
	if (user) {
        // generate a token 
		const token = jwt.sign(
			{ login: user.login, username: user.username },
			process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // expiration time is set to 1 hour
		);
		res.json({ token });
        return;
	}

	res.status(401).send('invalid creds');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
