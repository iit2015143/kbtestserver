function readconfig(callback){
  var fs = require('fs');
  var obj = fs.readFileSync('./saveconfig.json');
  obj = JSON.parse(obj);
  return obj;
}
module.exports = readconfig;
