import { renderMyBookings } from "../components/userDashboard/renderMyBookings";
import { renderMyListings } from "../components/userDashboard/renderMyListings";
import { renderMyProfile } from "../components/userDashboard/renderMyProfile";

export function renderUserProfile(container: HTMLElement, id: string) {
  container.innerHTML = `
    <div class="profile-container text-center mt-4">
      <div class="profile-buttons mb-4">
        <button id="profile" class="btn btn-outline-danger mx-2">Profile</button>
        <button id="listings" class="btn btn-outline-danger mx-2">Listings</button>
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

      if (clickedButton.id === "profile") {
        renderMyProfile(profileContent, id);
      } else if (clickedButton.id === "listings") {
        console.log("renderMyListings");
        renderMyListings(profileContent, id);
      }
    });
  });

  // Optionally, set default active state
  document.getElementById("profile")?.click();
}
