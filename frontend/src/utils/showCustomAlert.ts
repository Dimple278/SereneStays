import { AlertOptions } from "../interfaces/alertOptions";

export function showCustomAlert(options: AlertOptions): void {
  const {
    message,
    type = "info",
    duration = 3000,
    dismissible = true,
  } = options;

  // Create alert element
  const alertElement = document.createElement("div");
  alertElement.className = `alert alert-${getBootstrapAlertType(
    type
  )} alert-dismissible fade show`;
  alertElement.setAttribute("role", "alert");

  // Add icon
  const icon = document.createElement("i");
  icon.className = `bi ${getBootstrapIcon(type)} me-2`;
  alertElement.appendChild(icon);

  // Add message
  const messageElement = document.createElement("span");
  messageElement.innerHTML = message;
  alertElement.appendChild(messageElement);

  // Add close button if dismissible
  if (dismissible) {
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close";
    closeButton.setAttribute("data-bs-dismiss", "alert");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.onclick = () => removeAlert(alertElement);
    alertElement.appendChild(closeButton);
  }

  // Style the alert
  alertElement.style.position = "fixed";
  alertElement.style.top = "20px";
  alertElement.style.right = "20px";
  alertElement.style.maxWidth = "300px";
  alertElement.style.zIndex = "1000";
  alertElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  alertElement.style.transition = "all 0.3s ease-in-out";
  alertElement.style.transform = "translateX(120%)";

  // Add to DOM
  document.body.appendChild(alertElement);

  // Trigger entrance animation
  setTimeout(() => {
    alertElement.style.transform = "translateX(0)";
  }, 100);

  // Remove after duration
  if (duration !== Infinity) {
    setTimeout(() => removeAlert(alertElement), duration);
  }
}

function removeAlert(alertElement: HTMLElement): void {
  alertElement.classList.remove("show");
  setTimeout(() => {
    if (alertElement.parentNode) {
      alertElement.parentNode.removeChild(alertElement);
    }
  }, 300);
}

function getBootstrapAlertType(type: string): string {
  switch (type) {
    case "success":
      return "success";
    case "error":
      return "danger";
    case "warning":
      return "warning";
    case "info":
    default:
      return "info";
  }
}

function getBootstrapIcon(type: string): string {
  switch (type) {
    case "success":
      return "bi-check-circle-fill";
    case "error":
      return "bi-x-circle-fill";
    case "warning":
      return "bi-exclamation-triangle-fill";
    case "info":
    default:
      return "bi-info-circle-fill";
  }
}
