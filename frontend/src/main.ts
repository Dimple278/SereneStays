import UniversalRouter, { Route, RouterContext } from "universal-router";
import { initializeListings } from "./pages/index";
import { renderShowPage } from "./pages/show";
import { renderNewPage } from "./pages/new";
import { loadNavbar } from "./components/header/navbar";
import { loadFooter } from "./components/footer/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { renderLoginPage } from "./pages/login";
import { renderSignupPage } from "./pages/signup";
import { renderProfilePage } from "./pages/profile";
import { renderEditProfile } from "./components/userDashboard/renderEditProfile";
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
if (!mainContent) {
  console.error("Main content element not found");
}

// Inject navbar and footer
await loadNavbar();
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
      if (mainContent) await renderLoginPage(mainContent);
      return true;
    },
  },
  {
    path: "/signup",
    action: async () => {
      if (mainContent) await renderSignupPage(mainContent);
      return true;
    },
  },
  {
    path: "/listings",
    action: async () => {
      if (mainContent) await initializeListings(mainContent);
      return true;
    },
  },
  {
    path: "/new",
    action: async () => {
      if (mainContent) await renderNewPage(mainContent);
      return true;
    },
  },
  {
    path: "/show/:id",
    action: async ({ params }: { params: RouteParams }) => {
      if (mainContent && params.id)
        await renderShowPage(mainContent, params.id);
      return true;
    },
  },
  {
    path: "/edit/:id",
    action: async ({ params }: { params: RouteParams }) => {
      if (mainContent && params.id)
        await renderEditPage(mainContent, params.id);
      return true;
    },
  },
  {
    path: "/dashboard",
    action: async () => {
      if (mainContent) {
        if (currUser?.role === "superadmin") renderDashboardPage(mainContent);
        else if (currUser) renderProfilePage(mainContent);
        else await navigate("/login");
      }
      return true;
    },
  },
  {
    path: "/edit-profile/:id",
    action: async ({ params }: { params: RouteParams }) => {
      if (mainContent && params.id)
        await renderEditProfile(mainContent, params.id);
      return true;
    },
  },
  {
    path: "/user/:id",
    action: async ({ params }: { params: RouteParams }) => {
      if (mainContent && params.id) renderUserProfile(mainContent, params.id);
      return true;
    },
  },
  {
    path: "/",
    action: async () => {
      if (mainContent) await initializeListings(mainContent);
      return true;
    },
  },
  {
    path: "*",
    action: async () => {
      if (mainContent) renderNotFoundPage(mainContent);
      return true;
    },
  },
];

// Create the router instance
const router = new UniversalRouter(routes);

// Handle navigation
export async function navigate(path: string, pushState = true) {
  if (pushState) window.history.pushState({}, "", path);
  try {
    const result = await router.resolve({ pathname: path });
    if (!result && mainContent) renderNotFoundPage(mainContent);
  } catch (error) {
    console.error("Error resolving route:", error);
    if (mainContent) renderNotFoundPage(mainContent);
  }
}

// Handle browser navigation (back/forward buttons)
window.onpopstate = () => navigate(window.location.pathname, false);

// Initial load
navigate(window.location.pathname);
