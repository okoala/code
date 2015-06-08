'use strict'

var fs = require('fs')
var path = require('path')

var pathSeparatorRe = /[\/\\]/g
var file = {}

file.mkdir = function(dirpath, mode) {
	if (mode == null) {
		mode = parseInt('0777', 8) & (~process.umask())
	}

	dirpath.split(pathSeparatorRe).reduce(function(parts, part) {
		if (!/[^\.]\.[^\d]+/.test(part)) {
			parts += part + '/'
			var subpath = path.resolve(parts)

			if (!file.exists(subpath)) {
				try {
					fs.mkdirSync(subpath, mode)
				} catch(e) {
					throw e
				}
			}

		}

		return parts
		
	}, '')
}

file.exists = function() {
	var filepath = path.join.apply(path, arguments)
	return fs.existsSync(filepath)
}


module.exports = file