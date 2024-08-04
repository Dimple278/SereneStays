import axios from "axios";
import { navigate } from "../main";
import { compressImage } from "../utils/compressImage";
import { showCustomAlert } from "../utils/showCustomAlert";

export function renderSignupPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body p-5">
              <h2 class="text-center mb-4" style="color: #FF5A5F;">Sign Up</h2>
              <form id="signup-form" class="needs-validation" novalidate enctype="multipart/form-data">
                <div class="form-group mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" class="form-control" id="name" name="name" required>
                  <div class="invalid-feedback">Name is required.</div>
                </div>
                <div class="form-group mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" name="email" required>
                  <div class="invalid-feedback">Valid email is required.</div>
                </div>
                <div class="form-group mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" name="password" required minlength="6">
                  <div class="invalid-feedback">Password must be at least 6 characters long.</div>
                </div>
                <div class="form-group mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
                  <div class="invalid-feedback">Passwords do not match.</div>
                </div>
                <div class="form-group mb-3">
                  <label for="image" class="form-label">Upload Profile Picture</label>
                  <input type="file" class="form-control" id="image" name="image" accept="image/*" required>
                  <div class="invalid-feedback">Profile picture is required.</div>
                  <div id="imagePreview" class="mt-3"></div>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 mb-3" style="background-color: #FF5A5F; border-color: #FF5A5F;">Sign Up</button>
              </form>
              <hr class="my-4">
              <div class="text-center">
                <p class="mb-2">Already registered?</p>
                <button id="login-button" class="btn btn-outline-secondary w-100">Log in</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="loading" class="position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow-sm" style="display: none; z-index: 9999;">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 mb-0">Signing you up...</p>
      </div>
    </div>
  `;

  const form = document.getElementById("signup-form") as HTMLFormElement;
  const imageInput = document.getElementById("image") as HTMLInputElement;
  const imagePreview = document.getElementById(
    "imagePreview"
  ) as HTMLDivElement;
  const loadingScreen = document.getElementById("loading") as HTMLDivElement;
  const loginButton = document.getElementById(
    "login-button"
  ) as HTMLButtonElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmPasswordInput = document.getElementById(
    "confirmPassword"
  ) as HTMLInputElement;

  imageInput.addEventListener("change", () => {
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target?.result}" alt="Profile Picture" class="img-thumbnail" style="width: 150px; height: auto;">`;
      };
      reader.readAsDataURL(imageInput.files[0]);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity("Passwords do not match");
    } else {
      confirmPasswordInput.setCustomValidity("");
    }

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const formData = new FormData(form);
    formData.delete("confirmPassword"); // Remove confirm password from form data

    try {
      loadingScreen.style.display = "block";

      if (imageInput.files && imageInput.files[0]) {
        const originalImage = imageInput.files[0];
        const compressedImage = await compressImage(originalImage);
        formData.set("image", compressedImage, "profile_picture.jpg");
      }

      const response = await axios.post("/api/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Signup failed");
      }

      showCustomAlert({
        message: "Signup successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error("Error:", error);

      let errorMessage = "Signup failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      }

      showCustomAlert({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      loadingScreen.style.display = "none";
    }
  });

  loginButton.addEventListener("click", () => {
    navigate("/login");
  });
}
