import UniversalRouter, { Route } from "universal-router";
import { fetchListings, renderListings } from "./scripts/index";
import { renderShowPage } from "./scripts/show";
import { renderEditPage } from "./scripts/edit";
import { renderNewPage } from "./scripts/new";
import { loadNavbar } from "./components/navbar";
import { loadFooter } from "./components/footer";
import "bootstrap/dist/css/bootstrap.min.css";

// Define an interface for route parameters
interface RouteParams {
  id?: string;
}

// Get the main content area of the page
const mainContent = document.getElementById("main-content");

// Inject navbar and footer
loadNavbar();
loadFooter();

// Define route handlers
const routes: Route[] = [
  {
    path: "/",
    action: async () => {
      if (mainContent) {
        const listings = await fetchListings();
        renderListings(mainContent, listings);
      }
    },
  },
  {
    path: "/listings",
    action: async () => {
      if (mainContent) {
        const listings = await fetchListings();
        renderListings(mainContent, listings);
      }
    },
  },
  {
    path: "/new",
    action: () => {
      if (mainContent) {
        renderNewPage(mainContent);
      }
    },
  },
  {
    path: "/show/:id",
    action: ({ params }: { params: RouteParams }) => {
      if (mainContent) {
        const { id } = params;
        if (id) {
          renderShowPage(mainContent, id);
        }
      }
    },
  },
  {
    path: "/edit/:id",
    action: ({ params }: { params: RouteParams }) => {
      if (mainContent) {
        const { id } = params;
        if (id) {
          renderEditPage(mainContent, id);
        }
      }
    },
  },
];

// Create the router instance
const router = new UniversalRouter(routes);

// Handle navigation
async function navigate(path: string) {
  window.history.pushState({}, "", path);
  await router.resolve({ pathname: path });
}

// Add click event listeners to all navigation links
document.querySelectorAll("nav a[data-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    const page = target.dataset.link;
    if (page) {
      navigate(`/${page}`);
    }
  });
});

// Handle browser navigation (back/forward buttons)
window.onpopstate = () => {
  navigate(window.location.pathname);
};

// Initial load
navigate(window.location.pathname);
