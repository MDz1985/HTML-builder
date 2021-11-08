const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');
const stylesPath = `${__dirname}/styles`;
let cssFilesCount = 0;
let data = '';
let resultArray = [];
let readStream;
const writeStream = fs.createWriteStream(`${__dirname}/project-dist/bundle.css`);



async function x (){
  try {
    const files = await fsPromise.readdir(stylesPath);
    for (const file of files){
      fs.stat(`${stylesPath}/${file}`, (err, stats) => {

        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile()  && path.extname(file) === '.css' ){
          cssFilesCount++;

          readStream = fs.createReadStream(`${stylesPath}/${file}`, 'utf-8');
          readStream.on('data', chunk => {
            // data += chunk);
          // readStream.on('end', () => {
            resultArray.push(chunk);
            if (resultArray.length === cssFilesCount){
              writeStream.write(resultArray.join('\n\n'));
            }
          });
          readStream.on('error', error => console.log('Error', error.message));
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

x().then();


