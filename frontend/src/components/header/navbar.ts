import { loadCss } from "../../utils/loadCss";
import { navigate } from "../../main";
import { getCurrUser } from "../../api/getCurrUser";

export async function loadNavbar() {
  loadCss("/src/styles/navbar.css");
  const response = await fetch("/src/components/header/navbar.html");
  const navbarHTML = await response.text();
  const header = document.getElementById("header");

  if (header) {
    header.innerHTML = navbarHTML;

    const userFnx = document.querySelector(".user-fnx");
    const userIcon = document.querySelector(".nav-user");
    const authLinkLogin = document.getElementById("nav-auth-login");

    // Check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const currUser = await getCurrUser();
        const userIconContainer = document.getElementById(
          "user-icon-container"
        );
        if (userIconContainer && currUser) {
          userIconContainer.innerHTML = `
            <img src="${currUser.image}" alt="User" id="user-img" class="user-icon" />
            <img src="/Icon/navbar-icon.png" alt="Nav Icon" id="png-img-bar" />
          `;
        }

        if (authLinkLogin) {
          authLinkLogin.textContent = "LogOut";
          authLinkLogin.addEventListener("click", () => {
            localStorage.removeItem("token");
            navigate(`/login`);
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      if (authLinkLogin) {
        authLinkLogin.textContent = "LogIn";
        authLinkLogin.addEventListener("click", () => navigate("/login"));
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

    // Add event listeners for navigation
    document
      .getElementById("nav-home")
      ?.addEventListener("click", () => navigate("/"));
    document
      .getElementById("nav-profile")
      ?.addEventListener("click", () => navigate("/dashboard"));
    document
      .getElementById("nav-new")
      ?.addEventListener("click", () => navigate("/new"));

    const authElements = document.querySelectorAll("#nav-auth");
    authElements.forEach((element) => {
      element.addEventListener("click", (event) => {
        const authType = (event.target as HTMLElement).getAttribute(
          "data-auth"
        );
        if (authType) {
          navigate(`/${authType}`);
        }
      });
    });
  }
}
