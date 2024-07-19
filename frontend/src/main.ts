import { fetchListings, renderListings } from "./scripts/index";
import { renderShowPage } from "./scripts/show";
import { renderEditPage } from "./scripts/edit";
import { renderNewPage } from "./scripts/new";

document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");

  async function navigate(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    const page = target
      ? target.dataset.link
      : window.location.pathname.slice(1);

    if (page) {
      window.history.pushState({}, "", `/${page}`);

      if (mainContent) {
        if (page === "listings") {
          const listings = await fetchListings();
          renderListings(mainContent, listings);
        } else if (page === "new") {
          renderNewPage(mainContent);
        } else if (page.startsWith("show")) {
          const id = page.split("/")[1];
          renderShowPage(mainContent, id);
        } else if (page.startsWith("edit")) {
          const id = page.split("/")[1];
          renderEditPage(mainContent, id);
        }
      }
    }
  }

  document.querySelectorAll("nav a[data-link]").forEach((link) => {
    link.addEventListener("click", navigate);
  });

  window.onpopstate = () => {
    const path = window.location.pathname.slice(1);
    if (mainContent) {
      if (path === "listings") {
        fetchListings().then((listings) =>
          renderListings(mainContent, listings)
        );
      } else if (path === "new") {
        renderNewPage(mainContent);
      } else if (path.startsWith("show")) {
        const id = path.split("/")[1];
        renderShowPage(mainContent, id);
      } else if (path.startsWith("edit")) {
        const id = path.split("/")[1];
        renderEditPage(mainContent, id);
      }
    }
  };

  // Initial load
  const initialPath = window.location.pathname.slice(1);
  if (initialPath) {
    navigate(new Event("popstate"));
  }
});
