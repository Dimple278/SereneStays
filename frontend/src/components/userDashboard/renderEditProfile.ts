import { navigate } from "../../main";
import { loadNavbar } from "../header/navbar";
import { currUser } from "../../api/getCurrUser";
import { fetchUserById, updateUser } from "../../api/usersAPI";
import { showCustomAlert } from "../../utils/showCustomAlert";

export async function renderEditProfile(
  container: HTMLElement,
  userId: string
) {
  if (!userId) {
    showCustomAlert({
      message: "User ID is not available. Please log in again.",
      type: "error",
    });
    navigate("/login");
    return;
  }

  try {
    const user = await fetchUserById(userId);
    container.innerHTML = `
      <div class="container mt-5">
        <h3>Edit Profile</h3>
        <form id="editProfileForm" class="needs-validation" novalidate enctype="multipart/form-data">
          <div class="mb-3">
            <label for="image" class="form-label">Profile Image</label>
            <input type="file" name="image" id="imageInput" class="form-control" accept="image/*" />
            <div class="mt-3">
              <p>Current Profile Image:</p>
              <img src="${user.image}" alt="Current Profile Image" class="img-thumbnail" style="width: 150px; height: auto;" />
            </div>
            <div id="newImagePreview" class="mt-3" style="display: none;">
              <p>New Profile Image:</p>
              <div class="border p-2"></div>
            </div>
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" value="${user.name}" name="name" id="name" class="form-control" required />
            <div class="invalid-feedback">Please enter your name.</div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" value="${user.email}" name="email" id="email" class="form-control" required />
            <div class="invalid-feedback">Please enter a valid email address.</div>
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
        <div id="loading" class="position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow-sm" style="display: none; z-index: 9999;">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 mb-0">Updating profile...</p>
          </div>
        </div>
      </div>
    `;

    const editProfileForm = document.getElementById(
      "editProfileForm"
    ) as HTMLFormElement | null;
    const imageInput = document.getElementById(
      "imageInput"
    ) as HTMLInputElement | null;
    const newImagePreview = document.getElementById(
      "newImagePreview"
    ) as HTMLDivElement | null;
    const loadingDiv = document.getElementById(
      "loading"
    ) as HTMLDivElement | null;

    if (imageInput && newImagePreview) {
      imageInput.addEventListener("change", () => {
        if (imageInput.files && imageInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newImagePreview.style.display = "block";
            const previewContainer = newImagePreview.querySelector("div");
            if (previewContainer) {
              previewContainer.innerHTML = `<img src="${e.target?.result}" alt="New Profile Image" class="img-thumbnail" style="width: 150px; height: auto;" />`;
            }
          };
          reader.readAsDataURL(imageInput.files[0]);
        } else {
          newImagePreview.style.display = "none";
        }
      });
    }

    if (editProfileForm && loadingDiv) {
      editProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!editProfileForm.checkValidity()) {
          event.stopPropagation();
          editProfileForm.classList.add("was-validated");
          return;
        }

        const formData = new FormData(editProfileForm);
        loadingDiv.style.display = "flex";

        try {
          await updateUser(userId, formData);
          await loadNavbar();
          showCustomAlert({
            message: "Profile updated successfully!",
            type: "success",
          });
          navigate("/dashboard");
        } catch (error: any) {
          console.error("Error updating profile:", error);

          let errorMessage = "Failed to update profile. Please try again.";

          if (error.response && error.response.data) {
            if (typeof error.response.data === "string") {
              errorMessage = error.response.data;
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
            }
          }

          showCustomAlert({
            message: errorMessage,
            type: "error",
          });
        } finally {
          loadingDiv.style.display = "none";
        }
      });
    }
  } catch (error: any) {
    console.error("Error fetching user data:", error);

    let errorMessage = "Failed to load profile data. Please try again.";

    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        errorMessage = "Your session has expired. Please log in again.";
        navigate("/login");
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }

    showCustomAlert({
      message: errorMessage,
      type: "error",
    });
  }
}
