import axios from "axios";
import { navigate } from "../main";

export function renderLoginPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body p-5">
              <h2 class="text-center mb-4" style="color: #FF5A5F;">Login</h2>
              <form id="login-form">
                <div class="form-group mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" required>
                </div>
                <div class="form-group mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 mb-3" style="background-color: #FF5A5F; border-color: #FF5A5F;">Login</button>
              </form>
              <div id="message" class="mt-3"></div>
              <hr class="my-4">
              <div class="text-center">
                <p class="mb-2">Not registered yet?</p>
                <button id="signup-button" class="btn btn-outline-secondary w-100">Create an account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById("login-form") as HTMLFormElement;
  const signupButton = document.getElementById(
    "signup-button"
  ) as HTMLButtonElement;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const messageDiv = document.getElementById("message") as HTMLDivElement;

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.accessToken);
      messageDiv.innerHTML =
        '<div class="alert alert-success">Login successful!</div>';
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Reload the page to reflect changes
      }, 2000); // Redirect to home page after 2 seconds
    } catch (error: any) {
      console.error("Error:", error);

      // Check if error response exists and display the message
      let errorMessage = "Login failed";
      if (error.response) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data) {
          errorMessage = error.response.data;
        }
      }
      messageDiv.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
    }
  });

  signupButton.addEventListener("click", () => {
    navigate("/signup");
  });
}
