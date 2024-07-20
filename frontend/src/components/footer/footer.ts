export function loadFooter() {
  fetch("/src/components/footer/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("body")!.insertAdjacentHTML("beforeend", data);
    })
    .catch((error) => console.error("Error loading footer:", error));
}
