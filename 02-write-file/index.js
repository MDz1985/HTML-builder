const fs = require('fs');
const writeStream = fs.createWriteStream(`${__dirname}/text.txt`);
const { stdin, stdout } = process;

stdout.write('Lets write text and add it to "text.txt" file!\n');
stdin.on('data', data => {
  if (data.toString().toLowerCase() === 'exit\n'){
    process.exit();
  }
  writeStream.write(data);
  // process.exit();
});
process.on('exit', () => stdout.write('\nУдачи!'));
process.on('SIGINT', () => process.exit());
process.on('error', error => console.log('Error', error.message));
writeStream.on('error', error => console.log('Error', error.message));
