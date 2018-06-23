const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

module.exports.findPattern = function (files, regex) {
  const emitter = new EventEmitter();
  files.forEach(function (file) {
    fs.readFile(file, 'utf-8', function(err, content){
      if(err)
        return emitter.emit('error', err);

      emitter.emit('fileRead', file);
      let match;
      if(match = content.match(regex))
        match.forEach(elem => emitter.emit('found', file, elem));
    });
  });
  return emitter;
}
