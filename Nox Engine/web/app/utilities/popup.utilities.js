export class Message {
  constructor(text) {
    this.text = text;
    this.container = null;
  }

  show() {
    return new Promise((resolve) => {
      this.container = document.createElement('div');
      Object.assign(this.container.style, {
        background: '#1e1e1e',
        width: "300px",
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '5px',
        border: '1px solid #3c3c3c',
        borderRadius: '5px',
        textAlign: 'start',
        zIndex: 9999
      });

      this.containerButton = document.createElement('div');
      Object.assign(this.containerButton.style, {
        width: "100%",
        textAlign: 'end',
      });

      const messageText = document.createElement('p');
      messageText.textContent = this.text;
      Object.assign(messageText.style, {
        marginBottom: '10px'
      });

      const continueButton = document.createElement('button');
      continueButton.textContent = 'continue';
      continueButton.classList.add('btn-secondary');

      continueButton.onclick = () => {
        this.container.remove();
        resolve(true);
      };

      this.container.appendChild(messageText);
      this.container.appendChild(this.containerButton);
      this.containerButton.appendChild(continueButton);
      document.body.appendChild(this.container);
    });
  }
}

export class MessageInput {
  constructor({ placeholderText, confirmButtonText, cancelButtonText, required = false}) {
    this.placeholderText = placeholderText;
    this.confirmButtonText = confirmButtonText;
    this.cancelButtonText = cancelButtonText;
    this.required = required;
    this.container = null;
    this.input = null;
  }

  show() {
    return new Promise((resolve, reject) => {
      this.container = document.createElement('div');
      Object.assign(this.container.style, {
        background: '#1e1e1e',
        width: "300px",
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '5px',
        border: '1px solid #3c3c3c',
        borderRadius: '5px',
        textAlign: 'end',
        zIndex: 9999
      });

      this.input = document.createElement('input');
      this.input.type = 'text';
      this.input.placeholder = this.placeholderText;
      Object.assign(this.input.style, {
        width: '100%',
        marginBottom: "10px",
      });

      const confirmButton = document.createElement('button');
      confirmButton.textContent = this.confirmButtonText;
      confirmButton.classList.add('btn-secondary');
      Object.assign(confirmButton.style, {
        padding: '8px 16px',
        borderRadius: '5px',
      });

      const cancelButton = document.createElement('button');
      cancelButton.textContent = this.cancelButtonText;
      cancelButton.classList.add('btn-secondary');
      cancelButton.textContent = 'Cancelar';
      Object.assign(cancelButton.style, {
        marginLeft: '5px',
        padding: '8px 16px',
        borderRadius: '4px',
      });

      confirmButton.onclick = () => {
        this.container.remove();
        if (this.required && !this.input.value.trim()) {
          reject({ status: false, errorCode: "POP001", message: 'The field was not filled in.' });
          return;
        }
        resolve({status: true, value: this.input.value.trim()});
      };

      cancelButton.onclick = () => {
        this.container.remove();
        reject({status: true, value: this.input.value.trim()});
      };

      this.container.appendChild(this.input);
      this.container.appendChild(document.createElement('br'));
      this.container.appendChild(confirmButton);
      this.container.appendChild(cancelButton);
      document.body.appendChild(this.container);
      this.input.focus();
    });
  }
}

export class MessageConfirm {
  constructor({text: text, confirmButtonText = 'Confirm', cancelButtonText = 'Cancel'}) {
    this.text = text;
    this.confirmButtonText = confirmButtonText;
    this.cancelButtonText = cancelButtonText;
    this.container = null;
  }

  show() {
    return new Promise((resolve, reject) => {
      this.container = document.createElement('div');
      Object.assign(this.container.style, {
        background: '#1e1e1e',
        width: "300px",
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '5px',
        border: '1px solid #3c3c3c',
        borderRadius: '5px',
        textAlign: 'start',
        zIndex: 9999
      });

      this.containerButton = document.createElement('div');
      Object.assign(this.containerButton.style, {
        width: "100%",
        textAlign: 'end',
      });

      const messageText = document.createElement('p');
      messageText.textContent = this.text;
      Object.assign(messageText.style, {
        marginBottom: '10px',
        color: '#ccc'
      });

      const confirmButton = document.createElement('button');
      confirmButton.textContent = this.confirmButtonText;
      confirmButton.classList.add('btn-secondary');
      Object.assign(confirmButton.style, {
        padding: '8px 16px',
        borderRadius: '5px',
      });

      const cancelButton = document.createElement('button');
      cancelButton.textContent = this.cancelButtonText;
      cancelButton.classList.add('btn-secondary');
      cancelButton.textContent = 'Cancelar';
      Object.assign(cancelButton.style, {
        marginLeft: '5px',
        padding: '8px 16px',
        borderRadius: '4px',
      });

      confirmButton.onclick = () => {
        this.container.remove();
        resolve();
      };

      cancelButton.onclick = () => {
        this.container.remove();
        reject();
      };

      this.container.appendChild(messageText);
      this.container.appendChild(this.containerButton);
      this.containerButton.appendChild(confirmButton);
      this.containerButton.appendChild(cancelButton);
      document.body.appendChild(this.container);
    });
  }
}
export class ObjectSelection {
  constructor({ game }) {
    this.game = game;
    this.container = null;
    this.isOpen = false; // controla se o popup está aberto
  }

  show() {
    return new Promise((resolve, reject) => {
      if (this.isOpen) return; // impede abrir múltiplos popups
      this.isOpen = true;

      // Container principal
      this.container = document.createElement("div");
      Object.assign(this.container.style, {
        background: "#1e1e1e",
        width: "350px",
        maxHeight: "400px",
        overflowY: "auto",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
        border: "1px solid #3c3c3c",
        borderRadius: "5px",
        textAlign: "start",
        zIndex: 9999,
      });

      const objects = this.game["objects"];
      for (const folderName in objects) {
        const folderDiv = document.createElement("div");
        folderDiv.style.marginBottom = "8px";

        const folderLabel = document.createElement("p");
        folderLabel.textContent = folderName;
        Object.assign(folderLabel.style, {
          margin: "5px 0",
          color: "#29b1ffff",
          fontWeight: "bold",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "4px",
          background: "#2a2a2a",
          marginBottom: "4px",
        });

        const fileContainer = document.createElement("div");
        fileContainer.style.display = "none";

        const files = Object.keys(objects[folderName]);
        for (const fileName of files) {
          const fileBtn = document.createElement("button");
          fileBtn.textContent = fileName;
          Object.assign(fileBtn.style, {
            display: "block",
            width: "100%",
            textAlign: "left",
            marginBottom: "4px",
            padding: "6px",
            borderRadius: "4px",
            background: "#2a2a2a",
            color: "#ccc",
          });

          fileBtn.onclick = () => {
            this.close();
            resolve({ folderName, fileName });
          };

          fileContainer.appendChild(fileBtn);
        }

        folderLabel.onclick = () => {
          if (fileContainer.style.display === "none") {
            fileContainer.style.display = "block";
          } else {
            fileContainer.style.display = "none";
          }
        };

        folderDiv.appendChild(folderLabel);
        folderDiv.appendChild(fileContainer);
        this.container.appendChild(folderDiv);
      }

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      Object.assign(cancelButton.style, {
        marginTop: "10px",
        padding: "8px 16px",
        borderRadius: "4px",
        background: "#333",
        color: "#fff",
        width: "100%",
      });

      cancelButton.onclick = () => {
        this.close();
        reject();
      };

      this.container.appendChild(cancelButton);
      document.body.appendChild(this.container);
    });
  }

  close() {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.isOpen = false;
    }
  }
}
