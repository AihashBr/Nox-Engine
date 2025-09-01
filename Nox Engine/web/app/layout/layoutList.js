export class LayoutList {
  static folders({ elementId, rootFolder, folders }) {
    const element = document.getElementById(elementId);
    element.innerHTML = ''
    for (const folderName in folders) {
      element.innerHTML += `
      <div style="margin-top: 10px;">
        <div style="display: flex; align-items: center; margin-left: 5px;">
          <img src="app/icon/folder.svg">
          <button class="btn-folder" onclick="${rootFolder == 'objects'? `loadFiles({rootFolder: '${rootFolder}', folderName: '${folderName}'})` : `loadObjects({ rootFolder: '${rootFolder}', folderName: '${folderName}' })`}">${folderName}</button>
          <button class="btn-gray" style="width: 25px; height: 25px; margin-left: 5px;" onclick="${rootFolder == 'objects'? `createFile({folderName: '${folderName}'})` : `addObject({rootFolder: '${rootFolder}', folderNameScene:'${folderName}'})`}">+</button>
          <button class="btn-gray" style="width: 25px; height: 25px; margin-left: 5px;" onclick="deleteFolder({rootFolder: '${rootFolder}', folderName: '${folderName}'})">-</button>
        </div>
        <div id="${rootFolder == 'objects'? `files-${folderName}` : `objects-${folderName}`}" style="margin-left: 25px;"></div>
      </div>`;
    }
  }

  static files({ elementId, folderName, files }) {
    const element = document.getElementById(elementId);
    if (element.innerHTML.trim() == '') {
      for (const fileName of files) {
        element.innerHTML += `
        <div style="display: flex; align-items: center; margin-top: 5px;">
          <img src="app/icon/file.svg">
          <button class="btn-folder" onclick="openEditorCode({ folderName: '${folderName}', fileName: '${fileName}' })">${fileName}.js</button>
          <button class="btn-gray" style="width: 25px; height: 25px; margin-left: 5px;" onclick="deleteFile({folderName: '${folderName}', fileName: '${fileName}'})">-</button>
        </div>`;
      }
    } else {
      element.innerHTML = '';
    }
  }

  static objects({ elementId, folderName, objects }) {
    const element = document.getElementById(elementId);
    if (element.innerHTML.trim() == '') {
      for (const objectName of objects) {
        element.innerHTML += `
        <div style="display: flex; align-items: center; margin-top: 5px;">
          <img src="app/icon/object.svg">
          <button class="btn-folder" onclick="">${objectName}</button>
          <button class="btn-gray" style="width: 25px; height: 25px; margin-left: 5px;" onclick="deleteObject({ rootFolder: 'scene', folderName: '${folderName}', fileName: '${objectName}' })">-</button>
        </div>`;
      }
    } else {
      element.innerHTML = '';
    }
  }
}
