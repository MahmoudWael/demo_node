// module.exports = (message) => {
//   console.log('info: ' + message)
// }
//
// module.exports.verbose = (message) => {
//   console.log('verbose: ' + message);
// }


// function log(name){
//   this.name = name
// }
//
// log.prototype.lg = function (message) {
//   console.log(`[${this.name}] ${message}`);
// };
//
// log.prototype.info = function (message) {
//   this.lg(`info: ${message}`);
// };
//
// log.prototype.verbose = function(message){
//   this.lg(`verbose: ${message}`);
// }

class log {
  constructor(name) {
    this.name = name
  }

  lg(message){
    console.log(`[${this.name}] ${message}`);
  }

  info(message){
    this.lg(`info: ${message}`);
  }

  verbose(message){
    this.lg(`verbose: ${message}`);
  }
}

module.exports = log
