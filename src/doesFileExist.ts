import * as fs from 'fs';


export const doesFileExist = (pathToFile: string): Promise<boolean> => {
  return new Promise((resolve, reject) => fs.access(pathToFile, fs.constants.F_OK, (err) => {
    if (err) {
      resolve(false);
    }
    resolve(true);
  })
  );
};
