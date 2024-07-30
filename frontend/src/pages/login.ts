import axios from "axios";
import { navigate } from "../main";

export function renderLoginPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="container">
      <h2>Login</h2>
      <form id="login-form">
        <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" class="form-control" id="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
      <div id="message" class="mt-3"></div>
    </div>
  `;

  const form = document.getElementById("login-form") as HTMLFormElement;
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
}
