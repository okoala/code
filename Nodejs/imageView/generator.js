var fs = require('fs');
var recursive = require('recursive-readdir');
var easyimg = require('easyimage');

recursive('./images', function(err, files) {
    files = files.filter(function(filepath, index) {
        return /\.(png|jpeg|webp|jpg)$/g.test(filepath);
    });

    files.forEach(function(file, index) {
        easyimg.thumbnail({
            src: file,
            dst: file.replace(/^(images)/i, 'thumbs'),
            width: 85,
            height: 85,
            x: 0,
            y: 0
        }).then(function(file) {
            console.log(file);
        });
    });

    function makeXML(files) {
        var doctype = '<?xml version="1.0" encoding="UTF-8"?>';
        var start = '<juiceboxgallery galleryTitle="Juicebox-Pro Gallery" debugMode="true" splashDescription="This is a sample splash page description. Use this text to describe the gallery to users who are viewing on an mobile device." >';
        var end = '</juiceboxgallery>';

        var content = '';

        files.forEach(function(file, index) {
            content += '<image imageURL="' + file + '" thumbURL="' + file.replace(/^(images)/i, 'thumbs') + '" linkURL="' + file + '" linkTarget="_blank"></image>';
        });

        return doctype + start + content + end;
    }

    fs.writeFileSync('config.xml', makeXML(files));
});
