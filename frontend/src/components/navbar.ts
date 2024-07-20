export async function loadNavbar() {
  const response = await fetch("/src/components/navbar.html");
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
