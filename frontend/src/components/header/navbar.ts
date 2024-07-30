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
    const authLink = document.getElementById("auth-link") as HTMLAnchorElement;

    // Check if the user is logged in
    const token = localStorage.getItem("token");
    const currUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

    if (currUser) {
      const userIconContainer = document.getElementById("user-icon-container");
      if (userIconContainer) {
        userIconContainer.innerHTML = `
          <img src="${currUser.image}" alt="User" id="user-img" class="user-icon" />
          <img src="/Icon/navbar-icon.png" alt="Nav Icon" id="png-img-bar" />
        `;
      }
      if (authLink) {
        authLink.textContent = "LogOut";
        authLink.href = "#";
        authLink.addEventListener("click", () => {
          localStorage.removeItem("token");
          window.location.reload(); // Reload the page to reflect changes
        });
      }
    } else {
      if (authLink) {
        authLink.textContent = "LogIn";
        authLink.href = "/login";
      }
    }

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
