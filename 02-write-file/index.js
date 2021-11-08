const fs = require('fs');
const writeStream = fs.createWriteStream(`${__dirname}/text.txt`);
const { stdin, stdout } = process;

stdout.write('Lets write text and add it to "text.txt" file!\n' +
  'Есть 2 варианта исполнения: строка содержит "exit" и - строка и есть "exit"\n' +
  '(по умолчанию - 1-ый вариант). Если вы считаете, что должно работать по 2-му варианту,\n' +
  'пожалуйста, раскомментируйте строку 10 и закомментируйте строку 11\n');
stdin.on('data', data => {
  // if (data.toString().toLowerCase() === 'exit\n'){
  if (data.toString().toLowerCase().includes('exit')){
    process.exit();
  }
  writeStream.write(data);
  // process.exit();
});
process.on('exit', () => stdout.write('\nУдачи!'));
process.on('SIGINT', () => process.exit());
process.on('error', error => console.log('Error', error.message));
writeStream.on('error', error => console.log('Error', error.message));
