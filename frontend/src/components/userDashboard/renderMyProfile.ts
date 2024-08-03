import axios from "axios";
import { navigate } from "../../main";
import { getCurrUser } from "../../api/getCurrUser";
import { deleteUser } from "../../api/usersAPI";

export async function renderMyProfile(
  profileContent: HTMLElement,
  id?: string
) {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate(`/login`);
    // return;
  }

  try {
    const currUser = await getCurrUser();

    const userId = id || currUser.id;
    const isCurrentUser = userId === currUser.id;

    const userResponse = await axios.get(`/api/users/${userId}`, {
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
        .social-icon {
          width: 24px;
          height: 24px;
          margin: 0 5px;
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
            <p class="text-muted mb-2">
              <i class="fas fa-envelope me-2"></i>${User.email}
            </p>
          <div class="social-icon">
            <a target="_blank" href="https://github.com/Dimple278">
              <img src="/Icon/github.png" alt="GitHub" />
            </a>
            <a target="_blank" href="https://www.linkedin.com/in/dimple-saraogi-6b05a71bb/">
              <img src="/Icon/linkedIn.png" alt="LinkedIn" />
            </a>
            <a target="_blank" href="#">
              <img src="/Icon/instagram.png" alt="Instagram" />
            </a>
            <a target="_blank" href="#">
              <img src="/Icon/facebook.png" alt="Facebook" style="padding: 1px;" />
            </a>
            <a target="_blank" href="#">
              <img src="/Icon/twiter.png" alt="Twiter" />
            </a>
          </div>
        </div>
          ${
            isCurrentUser
              ? `
          <div class="d-flex flex-column flex-md-row justify-content-center">
            <button class="btn btn-primary mb-2 mb-md-0 me-md-2" id="edit-profile">
              <i class="fas fa-edit me-1"></i> Edit Profile
            </button>
            <button class="btn btn-danger mb-2 mb-md-0 me-md-2" id="delete-profile">
              <i class="fas fa-trash-alt me-1"></i> Delete Profile
            </button>
            <button class="btn btn-secondary" id="logout">
              <i class="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          </div>
          `
              : ""
          }
        </div>
      </div>
    `;

    if (isCurrentUser) {
      // Add event listeners for buttons
      profileContent
        .querySelector("#edit-profile")
        ?.addEventListener("click", () => {
          navigate(`/edit-profile/${User.id}`);
        });

      profileContent
        .querySelector("#delete-profile")
        ?.addEventListener("click", async () => {
          await deleteUser(currUser.id);
          localStorage.removeItem("token");
          navigate("/login");
        });

      profileContent.querySelector("#logout")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        navigate("/login");
      });
    }
  } catch (error) {
    console.error("Error loading profile data:", error);
    profileContent.innerHTML = `<p>Error loading profile data.</p>`;
  }
}
