import UniversalRouter, { Route } from "universal-router";
import { initializeListings } from "./pages/index";
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

import { renderDashboardPage } from "./pages/dashboard";
import { getCurrUser } from "./api/getCurrUser";
import { renderUserProfile } from "./pages/userProfile";
import { renderNotFoundPage } from "./pages/notFound";

// Define an interface for route parameters
interface RouteParams {
  id?: string;
}

// Get the main content area of the page
const mainContent = document.getElementById("main-content");

// Inject navbar and footer
loadNavbar();
loadFooter();

let currUser = null;
try {
  currUser = await getCurrUser();
} catch (error) {
  console.error("Error getting current user:", error);
}

// Define route handlers
const routes: Route[] = [
  {
    path: "/login",
    action: async () => {
      console.log("Login route matched");
      if (mainContent) {
        await renderLoginPage(mainContent);
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
    path: "/listings",
    action: async () => {
      if (mainContent) {
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
    path: "/dashboard",
    action: () => {
      if (mainContent) {
        if (currUser && currUser.role === "superadmin") {
          renderDashboardPage(mainContent);
        } else if (currUser) {
          renderProfilePage(mainContent);
        } else {
          navigate("/login");
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
  {
    path: "/user/:id",
    action: ({ params }: { params: RouteParams }) => {
      if (mainContent) {
        const { id } = params;
        if (id) {
          renderUserProfile(mainContent, id);
        }
      }
    },
  },
  {
    path: "/",
    action: async () => {
      if (mainContent) {
        initializeListings(mainContent);
      }
    },
  },
  // {
  //   path: "(.*)",
  //   action: () => {
  //     if (mainContent) {
  //       renderNotFoundPage(mainContent);
  //     }
  //   },
  // },
];

// Create the router instance
const router = new UniversalRouter(routes);

// Handle navigation
export async function navigate(path: string, pushState = true) {
  if (pushState) {
    window.history.pushState({}, "", path);
  }
  await router.resolve({ pathname: path });
}

// Handle browser navigation (back/forward buttons)
window.onpopstate = (event) => {
  navigate(window.location.pathname, false);
};

// Initial load
navigate(window.location.pathname);
