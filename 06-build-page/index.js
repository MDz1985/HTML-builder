const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');

let writeStreamCss;

const stylesPath = `${__dirname}/styles`;
let cssFilesCount = 0;
// let data = '';

let resultArray = [];
let readStream;

let newHtml = '';

let htmlCount = 0;
let matchCount = 0;

//TEMPLATE.HTML to variable newHtml
readStream = fs.createReadStream(`${__dirname}/template.html`, 'utf-8');
readStream.on('data', chunk => newHtml += chunk);
readStream.on('end', () => {
  return newHtml;
});

//read htmls in COMPONENTS

function read (htmls) {
  const readStream2 = fs.createReadStream(`${__dirname}/components/${htmls}.html`, 'utf-8');
  readStream2.on('data', chunk => {

    newHtml = newHtml.replace(htmls.padStart(htmls.length+2,'{{').padEnd(htmls.length+4,'}}'), chunk);
    matchCount++;

    if (htmlCount === matchCount){

      const writeStream = fs.createWriteStream(`${__dirname}//project-dist/index.html`);
      writeStream.write(newHtml);

    }


  });
  readStream2.on('error', error => console.log('Error', error.message));
}




//find html to replace and add it to array (and another find)

async function findFiles (folder){
  const folderPath = `${__dirname}/${folder}`;
  try {
    const files = await fsPromise.readdir(folderPath);
    for (const file of files){

      fs.stat(folderPath + '/'+ file, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isFile() ){
          if (path.extname(file) === '.html'){
            htmlCount++;
            read(path.basename(file, path.extname(file)));
          }
          else {
            copy (`${folder}/${file}`, `project-dist/${folder}/${file}`);
          }

        }

        if (stats.isDirectory()){
          makeDir ('project-dist/assets');
          makeDir (`project-dist/assets/${file}`);
          findFiles(`assets/${file}`);
        }

      });

    }
  } catch (err) {
    console.error(err);
  }
}


findFiles('components').then();
findFiles('assets').then();

//collect CSS
async function merge (){
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
          readStream.on('data', chunk => {//data += chunk);
          // readStream.on('end', () => {
            resultArray.push(chunk);
            if (resultArray.length === cssFilesCount){
              writeStreamCss.write(resultArray.join('\n\n'));
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



//MAKE DIR
async function makeDir (dir) {
  // let slash = '';
  // if (inDir){slash = '/';}else inDir = '';
  //
  let dirPath = `${__dirname}/${dir}`;
  try {

    await fsPromise.mkdir(dirPath, {recursive: true});

  } catch {
    console.log('Can\'t write');
  }
}


//COPy


async function copy (from, to) {

  try {

    await fsPromise.copyFile(`${__dirname}/${from}`, `${__dirname}/${to}`);

  } catch {
    console.log('Files could not be copied as they already exist');
  }
}




//Start

async function start () {

  try {

    await makeDir('project-dist');
    writeStreamCss = fs.createWriteStream(`${__dirname}/project-dist/style.css`);
    merge().then();
    await findFiles ('assets');

  } catch {
    console.log('Files could not be copied as they already exist');
  }
}


start().then();




