import { renderAllBookings } from "../components/renderAllBookings";
import { renderAllListings } from "../components/renderAllListings";
import { renderMyBookings } from "../components/renderMyBookings";
import { renderMyListings } from "../components/renderMyListings";
import { renderMyProfile } from "../components/renderMyProfile";

export function renderDashboardPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="profile-container text-center mt-4">
      <div class="profile-buttons mb-4">
        <button id="my-profile" class="btn btn-outline-danger mx-2">My Profile</button>
        <button id="all-users" class="btn btn-outline-danger mx-2">All Users</button>
        <button id="all-listings" class="btn btn-outline-danger mx-2">All Listings</button>
        <button id="all-bookings" class="btn btn-outline-danger mx-2">All Bookings</button>
      </div>
      <div id="profile-content" class="mt-4"></div>
    </div>
  `;

  const profileButtons = document.querySelectorAll(".profile-buttons .btn");

  profileButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Remove active class from all buttons
      profileButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      const clickedButton = event.currentTarget as HTMLElement;
      clickedButton.classList.add("active");

      const profileContent = document.getElementById(
        "profile-content"
      ) as HTMLElement;

      if (clickedButton.id === "my-profile") {
        renderMyProfile(profileContent);
      } else if (clickedButton.id === "all-listings") {
        renderAllListings(profileContent);
        // } else if (clickedButton.id === "my-listings") {
        // renderMyListings(profileContent);
      } else if (clickedButton.id === "all-users") {
        // renderAllUsers(profileContent);
      }
    });
  });

  // Optionally, set default active state
  document.getElementById("my-profile")?.click();
}