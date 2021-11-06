const fs = require('fs');
const readStream = fs.createReadStream(`${__dirname}/text.txt`, 'utf-8');
let data = '';

readStream.on('data', chunk => data += chunk);
readStream.on('end', () => console.log(data));
readStream.on('error', error => console.log('Error', error.message));