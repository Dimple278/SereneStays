import { Modal } from "bootstrap";

interface ConfirmOptions {
  message: string;
  onConfirm: () => void;
}

export function showCustomConfirm(options: ConfirmOptions): void {
  const { message, onConfirm } = options;

  // Create the modal if it doesn't exist
  let confirmModalElement = document.getElementById("customConfirmModal");
  if (!confirmModalElement) {
    confirmModalElement = document.createElement("div");
    confirmModalElement.id = "customConfirmModal";
    confirmModalElement.className = "modal fade";
    confirmModalElement.tabIndex = -1;
    confirmModalElement.setAttribute(
      "aria-labelledby",
      "customConfirmModalLabel"
    );
    confirmModalElement.setAttribute("aria-hidden", "true");
    confirmModalElement.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="customConfirmModalLabel">Confirm Action</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="customConfirmMessage">
              Are you sure you want to proceed?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="customConfirmButton">Confirm</button>
            </div>
          </div>
        </div>
      `;
    document.body.appendChild(confirmModalElement);
  }

  // Set the message
  const confirmMessageElement = document.getElementById("customConfirmMessage");
  if (confirmMessageElement) {
    confirmMessageElement.innerHTML = message;
  }

  // Handle confirm button click
  const confirmButtonElement = document.getElementById("customConfirmButton");
  if (confirmButtonElement) {
    const confirmHandler = () => {
      onConfirm();
      hideCustomConfirm();
      confirmButtonElement.removeEventListener("click", confirmHandler);
    };
    confirmButtonElement.addEventListener("click", confirmHandler);
  }

  // Show the modal using Bootstrap's JavaScript API
  if (confirmModalElement) {
    let bootstrapModal = Modal.getInstance(confirmModalElement);
    if (!bootstrapModal) {
      bootstrapModal = new Modal(confirmModalElement);
    }
    bootstrapModal.show();
  }
}

function hideCustomConfirm(): void {
  const confirmModalElement = document.getElementById("customConfirmModal");
  if (confirmModalElement) {
    const bootstrapModal = Modal.getInstance(confirmModalElement);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  }
}
