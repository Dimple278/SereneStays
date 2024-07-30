import { renderMyProfile } from "../components/renderMyProfile";
import { navigate } from "../main";

export function renderProfilePage(container: HTMLElement) {
  container.innerHTML = `
    <div class="profile-container">
      <h2>My Profile</h2>
      <div class="profile-buttons">
        <button id="my-profile" class="btn btn-primary">My Profile</button>
        <button id="my-bookings" class="btn btn-primary">My Bookings</button>
        <button id="my-listings" class="btn btn-primary">My Listings</button>
      </div>
      <div id="profile-content"></div>
    </div>
  `;

  document.getElementById("my-profile")?.addEventListener("click", () => {
    const profileContent = document.getElementById(
      "profile-content"
    ) as HTMLElement;
    renderMyProfile(profileContent);
  });

  document.getElementById("my-bookings")?.addEventListener("click", () => {
    renderMyBookings();
  });

  document.getElementById("my-listings")?.addEventListener("click", () => {
    renderMyListings();
  });
}

// function renderMyProfile() {
//   const profileContent = document.getElementById("profile-content");
//   if (profileContent) {
//     profileContent.innerHTML = `<p>This is My Profile content.</p>`;
//   }
// }
// renderMyProfile();
function renderMyBookings() {
  const profileContent = document.getElementById("profile-content");
  if (profileContent) {
    profileContent.innerHTML = `<p>This is My Bookings content.</p>`;
  }
}

function renderMyListings() {
  const profileContent = document.getElementById("profile-content");
  if (profileContent) {
    profileContent.innerHTML = `<p>This is My Listings content.</p>`;
  }
}
