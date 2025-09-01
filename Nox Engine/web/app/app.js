import { Message, MessageInput, MessageConfirm, ObjectSelection} from './utilities/popup.utilities.js';
import { Engine } from './engine.js';
import { LayoutList } from './layout/layoutList.js'

let engine = new Engine();

ace.config.set('basePath', '/lib/jsm/ace');
const editor = ace.edit('editor-code');
editor.setTheme('ace/theme/monokai');
editor.session.setMode('ace/mode/javascript');
editor.current = {folder: '', file: ''}

window.createFolder = (rootFolder) => {
  new MessageInput({
    placeholderText: "Folder name",
    confirmButtonText: "Create folder",
    cancelButtonText: "Cancel",
    required: true
  }).show().then(result => {
    engine.folder.create({
      rootFolder: rootFolder,
      folderName: result.value
    }).then(() => {
      loadFolders(rootFolder)
    }).catch(resultEngine => {
      new Message(`${resultEngine.message} Error code: ${resultEngine.errorCode}`).show();
    });
  }).catch(result => {
    if (!result.status) {
      new Message(`${result.message} Error code: ${result.errorCode}`).show();
    }
  });
}

window.deleteFolder = ({rootFolder, folderName}) => {
  new MessageConfirm({text: `Do you want to delete the ${folderName} folder?`}).show().then(() => {
    loadFolders(rootFolder);
    engine.folder.delete({rootFolder: rootFolder, folderName: folderName});
  }).catch();
}

window.loadFolders = (rootFolder) => {
  engine.folder.get({rootFolder: rootFolder}).then(result => {
    LayoutList.folders({
      elementId: `folders-${rootFolder}`, 
      rootFolder: rootFolder, 
      folders: result.folders || []
    })
  }).catch(result => {
    new Message(`${result.message} Error code: ${result.errorCode}`).show();
  });
}

window.createFile = ({ folderName }) => {
  new MessageInput({
    placeholderText: "File name",
    confirmButtonText: "Create file",
    cancelButtonText: "Cancel",
    required: true
  }).show().then(result => {
    engine.file.create({
      folderName: folderName,
      fileName: result.value
    }).then(() => {
      loadFiles({ folderName });
    }).catch(resultEngine => {
      new Message(`${resultEngine.message} Error code: ${resultEngine.errorCode}`).show();
    });
  }).catch(result => {
    if (!result.status) {
      new Message(`${result.message} Error code: ${result.errorCode}`).show();
    }
  });
};

window.deleteFile = ({ rootFolder, folderName, fileName }) => {
  new MessageConfirm({
    text: `Do you want to delete the file ${fileName}?`
  }).show().then(() => {
    engine.file.delete({ rootFolder, folderName, fileName });
    loadFiles({ rootFolder, folderName });
  }).catch();
};

window.loadFiles = ({ folderName }) => {
  engine.file.get({ folderName: folderName }).then(result => {
    LayoutList.files({
      elementId: `files-${folderName}`,
      folderName: folderName,
      files: result.files || []
    });
  }).catch(result => {
    new Message(`${result.message} Error code: ${result.errorCode}`).show();
  });
};

window.addObject = ({ rootFolder, folderNameScene }) => {
  new ObjectSelection({ game: engine.getGame() }).show()
  .then(({ folderName, fileName }) => {
    engine.file.addObject({
      folderNameScene: folderNameScene,
      folderName: folderName,
      fileName: fileName
    })
    .then(() => {
      loadObjects({rootFolder: rootFolder, folderName: folderNameScene})
    })
    .catch(result => {
      new Message(`${result.message} Error code: ${result.errorCode}`).show();
    });
  })
  .catch(result => {
    if (!result.status) {
      new Message(`${result.message} Error code: ${result.errorCode}`).show();
    }
  });
};

window.deleteObject = ({ rootFolder, folderName, fileName }) => {
  new MessageConfirm({
    text: `Do you want to delete the object ${fileName}?`
  }).show().then(() => {
    engine.file.delete({ rootFolder, folderName, fileName });
    loadObjects({ rootFolder, folderName });
  }).catch();
};

window.loadObjects = ({ rootFolder, folderName }) => {
  engine.file.get({ rootFolder: rootFolder, folderName: folderName }).then(result => {
    LayoutList.objects({
      elementId: `objects-${folderName}`,
      folderName: folderName,
      objects: result.files || []
    });
  }).catch(result => {
    new Message(`${result.message} Error code: ${result.errorCode}`).show();
  });
};

window.openEditorCode = ({ folderName, fileName }) => {
  engine.file.get({ folderName: folderName, fileName: fileName }).then(result => {
    editor.setValue(result.file.script, 1);
    editor.current = { folder: folderName, file: fileName };
  }).catch(result => {
    new Message(`${result.message} Error code: ${result.errorCode}`).show();
  });
}

window.saveEditorCode = () => {
  engine.file.set({ folderName: editor.current.folder, fileName: editor.current.file, value: editor.getValue() }).then().catch(result => {
    new Message(`${result.message} Error code: ${result.errorCode}`).show();
  });
}

loadFolders('objects');
loadFolders('scene');