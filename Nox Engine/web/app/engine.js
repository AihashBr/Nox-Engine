class Folder {
  constructor(game) {
    this.game = game;
  }

  create({ rootFolder, folderName }) {
    return new Promise((resolve, reject) => {
      if (this.game[rootFolder][folderName]) {
        reject({ status: false, errorCode: 'FOL001', message: 'This folder already exists.' });
        return;
      }
      this.game[rootFolder][folderName] = {};
      resolve({ status: true });
    });
  }

  delete({ rootFolder, folderName }) {
    delete this.game[rootFolder][folderName];
  }

  get({ rootFolder, folderName }) {
    return new Promise((resolve, reject) => {
      if (folderName) {
        if (!this.game[rootFolder][folderName]) {
          reject({ status: false, errorCode: 'FOL002', message: 'File does not exist.' });
          return;
        }
        resolve({ status: true, folders: this.game[rootFolder][folderName] });
        return;
      }
      resolve({ status: true, folders: this.game[rootFolder] });
    });
  }
}

class File {
  constructor(game) {
    this.game = game;
  }

  create({ folderName, fileName }) {
    return new Promise((resolve, reject) => {
      if (!this.game['objects'][folderName]) {
        reject({ status: false, errorCode: 'FIL001', message: 'Folder does not exist.' });
        return;
      }
      if (this.game['objects'][folderName][fileName]) {
        reject({ status: false, errorCode: 'FIL002', message: 'File already exists.' });
        return;
      }
      this.game['objects'][folderName][fileName] = {
        script: `// ${fileName}

window.${fileName} = ({scene}) => {
};

window.${fileName}Editor = () => {
};`
      };
      resolve({ status: true });
    });
  }

  delete({ rootFolder = 'objects', folderName, fileName }) {
    delete this.game[rootFolder]?.[folderName]?.[fileName];
  }

  get({ rootFolder = 'objects', folderName, fileName }) {
    return new Promise((resolve, reject) => {
      if (!this.game[rootFolder][folderName]) {
        reject({ status: false, errorCode: 'FIL003', message: 'Folder does not exist.' });
        return;
      }
      if (fileName) {
        if (!this.game[rootFolder][folderName][fileName]) {
          reject({ status: false, errorCode: 'FIL004', message: 'File does not exist.' });
          return;
        }
        resolve({ status: true, file: this.game[rootFolder][folderName][fileName] });
        return;
      }
      resolve({ status: true, files: Object.keys(this.game[rootFolder][folderName]) });
    });
  }

  set({ folderName, fileName, value }) {
    return new Promise((resolve, reject) => {
      if (!this.game['objects'][folderName]) {
        reject({ status: false, errorCode: 'FIL005', message: 'Folder does not exist.' });
        return;
      }
      if (!fileName) {
        reject({ status: false, errorCode: 'FIL006', message: 'File name is required.' });
        return;
      }
      this.game['objects'][folderName][fileName].script = value;
      resolve({ status: true, message: 'File saved successfully.' });
    });
  }

  addObject({ folderNameScene, folderName, fileName }) {
    return new Promise((resolve, reject) => {
      if (!this.game['objects'][folderName]) {
        reject({ status: false, errorCode: 'FIL007', message: 'Folder does not exist.' });
        return;
      }
      if (!this.game['objects'][folderName][fileName]) {
        reject({ status: false, errorCode: 'FIL008', message: 'File already exists.' });
        return;
      }
      if (!this.game['scene'][folderNameScene]) {
        reject({ status: false, errorCode: 'FIL009', message: 'Folder does not exist.' });
        return;
      }
      this.game['scene'][folderNameScene][fileName+this.game.id++] = {
        object: {
          folderName: folderName,
          fileName: fileName
        },
        parameters: {}
      }
      resolve({ status: true });
    });
  }
}

export class Engine {
  constructor() {
    this.game = {
      files: {},
      objects: {
        global: {}
      },
      scene: {},
      id: 1
    };
    this.folder = new Folder(this.game);
    this.file = new File(this.game);
  }

  getGame() {
    return this.game;
  }
}
