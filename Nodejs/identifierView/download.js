'use strict';

var path = require('path'),
	fs = require('fs'),
	http = require('http'),
	https = require('https'),
	EventEmitter = require('events').EventEmitter,
	eachAsync = require('each-async'),
	file = require('./file')

var downlaod = function(config, dest) {
	var urls = []
	var files = []
	var emitter = new EventEmitter()

	for (var i in config) {
		if (config.hasOwnProperty(i)) {
			var obj = {}

			obj.name = i
			obj.url = config[i].url
			obj.ver = config[i].version

			urls.push(obj.url)
			files.push(obj)
		}
	}

	eachAsync(urls, function(url, index, done) {
		var fileDest = path.resolve(dest, files[index].ver, files[index].name + '.js')

		files[index]['dest'] = fileDest

		if (file.exists(fileDest)) {
			if (!fs.readFileSync(fileDest, 'utf-8')) {
				fs.unlink(fileDest)
			} else {
				return done()
			}
		}

		file.mkdir(fileDest)

		var writeSteam = fs.createWriteStream(fileDest)
		var request
		

		if (url.indexOf('https') === 0) {
			request = https
		} else if (url.indexOf('http') === 0) {
			request = http
		} else {
			emitter.emit('error', 'Unknown Protocol')
			return
		}

		writeSteam.on('error', function(error) {
			console.log('err: ', error)
		})

		var req = request.get(url, function(res) {
			if (res.statusCode === 200) {
				emitter.emit('check', null, true)
				res
					.on('data', function(data) {
						writeSteam.write(data)
					})

					.on('end', function() {
						emitter.emit('end')

						writeSteam.on('close', function() {
							emitter.emit('close', null, url)
							done()
						})

						writeSteam.end()
					})

			} else {
				emitter.emit('check', null, false)
			}

			res.on('error', function(error) {
				req.abort();
				emitter.emit('error', error)
			})

			req.end()
		})

	}, function() {
		emitter.emit('done', files)
	})

	return emitter
}

module.exports = downlaod