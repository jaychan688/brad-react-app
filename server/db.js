const dotenv = require('dotenv')
dotenv.config({ path: './server/.env' })
const colors = require('colors')
const { MongoClient } = require('mongodb')

MongoClient.connect(process.env.CONNECTIONSTRING, function (err, client) {
	module.exports = client
	console.log(`MongoDB connected: ${client.options.hosts}`.cyan.bold.underline)

	const app = require('./app')
	app.listen(
		process.env.PORT,
		console.log(
			`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
				.yellow.bold.underline
		)
	)
})
