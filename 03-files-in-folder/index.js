
const fs = require('fs/promises');
const f = require('fs');
const path = require('path');
const folderPath = `${__dirname}/secret-folder`;

async function x (){
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files){

      f.stat(folderPath + '/'+ file, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isFile()){
          console.log (`${path.basename(file, path.extname(file))} --> ${path.extname(file).slice(1)} --> ${stats.size/1024} kB`); //true
        }
      });

    }
  } catch (err) {
    console.error(err);
  }
}




x().then();

