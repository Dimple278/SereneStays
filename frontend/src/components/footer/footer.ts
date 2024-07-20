import { loadCss } from "../../utils/loadCss";

export function loadFooter() {
  loadCss("/src/styles/footer.css");
  fetch("/src/components/footer/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("body")!.insertAdjacentHTML("beforeend", data);
    })
    .catch((error) => console.error("Error loading footer:", error));
}
