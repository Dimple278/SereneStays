import { loadCss } from "../../utils/loadCss";

export async function loadFooter() {
  loadCss("/src/styles/footer.css");
  const response = await fetch("/src/components/footer/footer.html");
  const footerHTML = await response.text();
  const footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = footerHTML;
  }
}
