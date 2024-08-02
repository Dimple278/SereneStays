import axios from "axios";
import { navigate } from "../../main";

export async function renderMyProfile(profileContent: HTMLElement) {
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

    const userResponse = await axios.get(`/api/users/${currUser.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const User = userResponse.data;

    profileContent.innerHTML = `
      <style>
        @media (min-width: 768px) {
          .profile-content {
            display: flex;
            align-items: center;
          }
          .profile-image {
            flex: 0 0 auto;
            margin-right: 2rem;
          }
          .profile-info-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .profile-info {
            text-align: center;
            margin-bottom: 1rem;
          }
        }
      </style>
      <div class="profile-content row mb-4 border rounded p-3 shadow-sm bg-light">
        <div class="profile-image col-md-auto text-center mb-3 mb-md-0">
          <img src="${
            User.image || "/default-user-image.png"
          }" alt="User Image" class="img-fluid rounded-circle" style="width: 150px; height: 150px; object-fit: cover;">
        </div>
        <div class="profile-info-wrapper col">
          <div class="profile-info">
            <h3 class="mb-2">${User.name}</h3>
            <p class="text-muted mb-3">${User.email}</p>
          </div>
          <div class="d-flex flex-column flex-md-row justify-content-center">
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
        navigate(`/edit-profile/${User.id}`);
      });

    profileContent
      .querySelector("#delete-profile")
      ?.addEventListener("click", async () => {
        try {
          await axios.delete(`/api/users/${currUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.removeItem("token");
          navigate("/login");
        } catch (error) {
          console.error("Error deleting profile:", error);
          alert("Failed to delete profile. Please try again.");
        }
      });

    profileContent.querySelector("#logout")?.addEventListener("click", () => {
      localStorage.removeItem("token");
      navigate("/login");
    });
  } catch (error) {
    console.error("Error loading profile data:", error);
    profileContent.innerHTML = `<p>Error loading profile data.</p>`;
  }
}