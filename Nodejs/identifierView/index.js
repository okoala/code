'use strict'

var fs = require('fs')
var swig = require('swig')
var path = require('path')
var esprima = require('esprima')
var esprimaWalk = require('esprima-walk')
var uniq = require('lodash/array/uniq')
var download = require('./download')

var config = require('./project.json')

var render = function(data) {
	var html = swig.compileFile(path.resolve(__dirname, './index.tpl'))({data: data})
	fs.writeFileSync('./dest/index.html', html, 'utf-8')
}

download(config, path.resolve(__dirname, 'dest', 'libs'))
	.on('done', function(files) {
		var result = []

		files.forEach(function(file, index) {
			var content = fs.readFileSync(file.dest, 'utf-8')
			var fileInfo = {
				name: file.name,
				ver: file.ver,
				identifiers: {}
			}

			var ast

			try {
				ast = esprima.parse(content, {loc: false,range: false,raw: false,tokens: true,comment: false})
			} catch(e) {
				// 如果报错就直接删除文件
				fs.unlink(file.dest)
				throw e
			}

			esprimaWalk.walkAddParent(ast, function(node) {
				var type = node.type

				if (type === 'Identifier') {
					var name = node.name
					var type = node.parent.type
					
					if (type && name) {
						var _nameList = fileInfo.identifiers[type] || []
							_nameList.push(name)

						fileInfo.identifiers[type] = _nameList
					}
				}
			})

			for (var i in fileInfo.identifiers) {
				fileInfo.identifiers[i] = uniq(fileInfo.identifiers[i])
			}

			result.push(fileInfo)
		})

		render(result)
	})


