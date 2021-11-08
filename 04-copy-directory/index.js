const fs = require('fs');
const fsPromise = require('fs/promises');
const outPath = `${__dirname}/files`;
const inPath = `${__dirname}/files-copy`;


fs.rm(inPath, { recursive: true }, () => {
  copy().then();
});



async function copy () {
  try {

    const dir = await fsPromise.mkdir(inPath, {recursive: true});
    const files = await fsPromise.readdir(outPath);
    for (const file of files) {


      await fsPromise.copyFile(`${outPath}/${file}`, `${dir}/${file}`);
    }
  } catch {
    console.log('Files could not be copied as they already exist');
  }
}
