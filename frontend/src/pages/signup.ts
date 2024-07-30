import axios from "axios";
import { navigate } from "../main";

export function renderSignupPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <h2 class="text-center mb-4">Signup</h2>
          <form id="signup-form" class="needs-validation" novalidate enctype="multipart/form-data">
            <div class="form-group mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" required>
              <div class="valid-feedback">Name looks good!</div>
              <div class="invalid-feedback">Name is required.</div>
            </div>
            <div class="form-group mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" class="form-control" id="email" required>
              <div class="valid-feedback">Email looks good!</div>
              <div class="invalid-feedback">Email is required.</div>
            </div>
            <div class="form-group mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" required>
              <div class="valid-feedback">Password looks good!</div>
              <div class="invalid-feedback">Password is required.</div>
            </div>
            <div class="form-group mb-3">
              <label for="image" class="form-label">Upload Profile Picture</label>
              <input type="file" class="form-control" id="image" accept="image/*">
              <div class="valid-feedback">Profile picture looks good!</div>
              <div class="invalid-feedback">Profile picture is required.</div>
              <div id="imagePreview" class="mt-3"></div>
            </div>
            <button type="submit" class="btn btn-danger w-100">Signup</button>
          </form>
          <div id="message" class="mt-3"></div>
        </div>
      </div>
    </div>
    <div id="loading" class="loading-overlay align-items-center justify-content-center" style="display: none;">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span class="ms-2">Signing you up...</span>
    </div>
  `;

  const form = document.getElementById("signup-form") as HTMLFormElement;
  const imageInput = document.getElementById("image") as HTMLInputElement;
  const imagePreview = document.getElementById(
    "imagePreview"
  ) as HTMLDivElement;
  const loadingScreen = document.getElementById("loading") as HTMLDivElement;

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
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const messageDiv = document.getElementById("message") as HTMLDivElement;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (imageInput.files && imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      loadingScreen.style.display = "flex"; // Show loading screen
      container.style.opacity = "0.5"; // Apply blur effect

      const response = await axios.post("/api/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      messageDiv.innerHTML =
        '<div class="alert alert-success">Signup successful!</div>';
      setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
    } catch (error: any) {
      console.error("Error:", error);

      // Check if error response exists and display the message
      let errorMessage = "Signup failed";
      if (error.response) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data) {
          errorMessage = error.response.data;
        }
      }
      messageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
    } finally {
      loadingScreen.style.display = "none"; // Hide loading screen
      container.style.opacity = "1"; // Remove blur effect
    }
  });
}
