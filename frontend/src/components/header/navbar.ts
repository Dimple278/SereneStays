import { loadCss } from "../../utils/loadCss";

export async function loadNavbar() {
  loadCss("/src/styles/navbar.css");
  const response = await fetch("/src/components/header/navbar.html");
  const navbarHTML = await response.text();
  const header = document.getElementById("header");

  if (header) {
    header.innerHTML = navbarHTML;

    const userFnx = document.querySelector(".user-fnx");
    const userIcon = document.querySelector(".nav-user");

    if (userIcon && userFnx) {
      userIcon.addEventListener("click", () => {
        (userFnx as HTMLDivElement).style.display =
          (userFnx as HTMLDivElement).style.display === "none"
            ? "block"
            : "none";
      });
    }
  }
}
