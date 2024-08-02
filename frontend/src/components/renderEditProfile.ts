import axios from "axios";
import { navigate } from "../main";
import { loadNavbar } from "../components/header/navbar"; // Import the loadNavbar function
import { currUser } from "../api/getCurrUser";
import { fetchUserById, updateUser } from "../api/usersAPI";

export async function renderEditProfile(container: HTMLElement) {
  const userId = currUser.id;
  try {
    const user = await fetchUserById(userId);
    container.innerHTML = `
      <div class="container mt-5">
        <h3>Edit Profile</h3>
        <form id="editProfileForm" class="needs-validation" novalidate enctype="multipart/form-data">
          <div class="mb-3">
            <label for="image" class="form-label">Profile Image</label>
            <input type="file" name="image" id="imageInput" class="form-control" />
            <img src="${user.image}" alt="Current Profile Image" class="img-thumbnail mt-2" style="width: 150px; height: auto;" />
            <div id="imagePreview" class="border p-2 mt-2"></div>
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" value="${user.name}" name="name" id="name" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" value="${user.email}" name="email" id="email" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
        <div id="loading" class="mt-3 text-center" style="display: none;">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Updating your profile...</p>
        </div>
      </div>
    `;

    const editProfileForm = document.getElementById(
      "editProfileForm"
    ) as HTMLFormElement | null;
    const imageInput = document.getElementById(
      "imageInput"
    ) as HTMLInputElement | null;
    const imagePreview = document.getElementById(
      "imagePreview"
    ) as HTMLDivElement | null;

    const loadingDiv = document.getElementById(
      "loading"
    ) as HTMLDivElement | null;

    if (imageInput && imagePreview) {
      imageInput.addEventListener("change", () => {
        if (imageInput.files) {
          imagePreview.innerHTML = ""; // Clear previous previews
          const file = imageInput.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const imgElement = document.createElement("img");
            imgElement.src = e.target?.result as string;
            imgElement.classList.add("img-thumbnail");
            imgElement.style.width = "150px";
            imgElement.style.height = "auto";
            imagePreview.appendChild(imgElement);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (editProfileForm && loadingDiv) {
      editProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(editProfileForm);
        loadingDiv.style.display = "block"; // Show loading message
        editProfileForm.style.display = "none"; // Hide the form
        try {
          await updateUser(userId, formData);

          // After updating the profile, refresh the navbar
          await loadNavbar();

          // Navigate back to profile page
          navigate(`/dashboard`);
        } catch (error) {
          console.error("Error updating profile:", error);
          loadingDiv.style.display = "none"; // Hide loading message
          editProfileForm.style.display = "block"; // Show the form again
        }
      });
    }
  } catch (error: any) {
    console.error("Error fetching user data:", error);

    // If the token is invalid or expired, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
}
