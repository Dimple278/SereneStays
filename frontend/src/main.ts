import UniversalRouter, { Route } from "universal-router";
import { initializeListings } from "./pages/index";
import { fetchListingsByCategory } from "./api/fetchListings";
import { renderShowPage } from "./pages/show";
import { renderNewPage } from "./pages/new";
import { loadNavbar } from "./components/header/navbar";
import { loadFooter } from "./components/footer/footer";
// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { renderLoginPage } from "./pages/login";
import { renderSignupPage } from "./pages/signup";
import { renderProfilePage } from "./pages/profile";
import { renderEditProfile } from "./components/renderEditProfile";
import { renderEditPage } from "./pages/edit";
import { renderMyProfile } from "./components/renderMyProfile";
import { renderDashboardPage } from "./pages/dashboard";

// Define an interface for route parameters
interface RouteParams {
  id?: string;
}

// Get the main content area of the page
const mainContent = document.getElementById("main-content");
// const listingContainer = document.getElementById("listings-container");
// Inject navbar and footer
loadNavbar();
loadFooter();
// renderFilterModal(); // Render the filter modal

const token = localStorage.getItem("token");
const currUser = token ? JSON.parse(atob(token.split(".")[1])) : null;
console.log(currUser.role);
// Define route handlers
const routes: Route[] = [
  {
    path: "/login",
    action: async () => {
      if (mainContent) {
        renderLoginPage(mainContent);
      }
    },
  },
  {
    path: "/signup",
    action: async () => {
      if (mainContent) {
        renderSignupPage(mainContent);
      }
    },
  },
  {
    path: "/",
    action: async () => {
      if (mainContent) {
        // const page = 1; // Initial page
        // const listingsPerPage = 10; // Number of listings per page
        // const { listings, totalCount } = await fetchListingsByCategory(
        //   "ALL",
        //   page,
        //   listingsPerPage
        // );
        // renderListings(mainContent, listings, totalCount);
        initializeListings(mainContent);
      }
    },
  },
  {
    path: "/listings",
    action: async () => {
      if (mainContent) {
        // const page = 1; // Initial page
        // const listingsPerPage = 10; // Number of listings per page
        // const { listings, totalCount } = await fetchListingsByCategory(
        //   "ALL",
        //   page,
        //   listingsPerPage
        // );
        // renderListings(mainContent, listings, totalCount);
        initializeListings(mainContent);
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
  {
    path: "/dashboard", // Add the profile route
    action: () => {
      console.log(currUser);
      if (mainContent) {
        if (currUser.role == "superadmin") {
          renderDashboardPage(mainContent);
        } else {
          renderProfilePage(mainContent);
        }
      }
    },
  },
  {
    path: "/edit-profile/:id",
    action: async ({ params }: { params: RouteParams }) => {
      if (mainContent && params.id) {
        renderEditProfile(mainContent);
      }
    },
  },
];

// Create the router instance
const router = new UniversalRouter(routes);

// Handle navigation
export async function navigate(path: string) {
  window.history.pushState({}, "", path);
  await router.resolve({ pathname: path });
}

// // Function to handle link clicks
// function handleLinkClick(event: Event) {
//   event.preventDefault();
//   const target = event.target as HTMLAnchorElement;
//   const page = target.dataset.link;
//   if (page) {
//     navigate(`/${page}`);
//   }
// }

// // Add click event listeners to all navigation links using event delegation
// document.addEventListener("click", (event) => {
//   const target = event.target as HTMLAnchorElement;
//   if (target.matches("nav a[data-link]")) {
//     handleLinkClick(event);
//   }
// });

// Handle browser navigation (back/forward buttons)
window.onpopstate = () => {
  navigate(window.location.pathname);
};

// Initial load
navigate(window.location.pathname);
