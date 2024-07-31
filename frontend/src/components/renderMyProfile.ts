import axios from "axios";
import { navigate } from "../main";

export async function renderMyProfile(profileContent: HTMLElement) {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    profileContent.innerHTML = `<p>Error loading profile data.</p>`;
    return;
  }

  try {
    const currUserResponse = await axios.get(`/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const currUser = currUserResponse.data;
    console.log("Current user:", currUser);

    const userResponse = await axios.get(`/api/users/${currUser.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const User = userResponse.data;

    profileContent.innerHTML = `
      <div class="row mb-4 border rounded p-3 shadow-sm bg-light">
        <div class="col-md-4 text-center">
          <img src="${
            User.image || "/default-user-image.png"
          }" alt="User Image" class="img-fluid rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover;">
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-center">
          <h3 class="mb-2">${User.name}</h3>
          <p class="text-muted mb-4">${User.email}</p>
          <div class="d-flex flex-column flex-md-row">
            <button class="btn btn-primary mb-2 mb-md-0 me-md-2" id="edit-profile">Edit Profile</button>
            <button class="btn btn-danger mb-2 mb-md-0 me-md-2" id="delete-profile">Delete Profile</button>
            <button class="btn btn-secondary" id="logout">Logout</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners for buttons
    profileContent
      .querySelector("#edit-profile")
      ?.addEventListener("click", () => {
        navigate(`/edit-profile/${User.id}`); // Navigate to the edit profile page
      });

    profileContent
      .querySelector("#delete-profile")
      ?.addEventListener("click", async () => {
        try {
          await axios.delete(`/api/users/${currUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.removeItem("token"); // Clear the token
          navigate("/login"); // Redirect to login page
        } catch (error) {
          console.error("Error deleting profile:", error);
          alert("Failed to delete profile. Please try again.");
        }
      });

    profileContent.querySelector("#logout")?.addEventListener("click", () => {
      localStorage.removeItem("token");
      navigate("/login"); // Redirect to login page
    });
  } catch (error) {
    console.error("Error loading profile data:", error);
    profileContent.innerHTML = `<p>Error loading profile data.</p>`;
  }
}
