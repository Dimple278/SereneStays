import axios from "axios";
import { navigate } from "../main";

export async function renderEditPage(container: HTMLElement, id: string) {
  try {
    const response = await axios.get(`/api/listings/${id}`);
    const listing = response.data;
    const token = localStorage.getItem("token");

    container.innerHTML = `
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-8 mx-auto">
            <h3>Edit Listing</h3>
            <form id="editForm" class="needs-validation" novalidate enctype="multipart/form-data">
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" value="${
                  listing.title
                }" name="title" class="form-control" required>
                <div class="valid-feedback">Title looks good!</div>
                <div class="invalid-feedback">Title is required.</div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea cols="20" rows="3" name="description" class="form-control" required>${
                  listing.description
                }</textarea>
                <div class="invalid-feedback">Description is required.</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Original Image Preview</label><br>
                ${listing.images
                  .map(
                    (img: string) => `
                  <img src="${img}" alt="Original Image" class="img-thumbnail mb-3" style="width: 150px; height: auto;">
                `
                  )
                  .join("")}
              </div>
              <div class="mb-3">
                <label for="images" class="form-label">Upload New Images</label>
                <input type="file" name="images" class="form-control" id="imageInput" multiple>
                <div class="invalid-feedback">Please upload images.</div>
              </div>
              <div class="mb-3">
                <label class="form-label">New Images Preview</label><br>
                <div id="imagePreview" class="border p-2"></div>
              </div>
              <div class="mb-3">
                <label for="category" class="form-label">Choose Category</label>
                <select id="category" name="category" class="form-select" multiple>
                  <option value="Beachfront">Beachfront</option>
                  <option value="Cabins">Cabins</option>
                  <option value="Omg">OMG</option>
                  <option value="Lake">Lake</option>
                  <option value="Design">Design</option>
                  <option value="Amazing Pools">Amazing pools</option>
                  <option value="Farms">Farms</option>
                  <option value="Amazing Views">Amazing views</option>
                  <option value="Rooms">Rooms</option>
                  <option value="Lakefront">Lakefront</option>
                  <option value="Tiny Homes">Tiny homes</option>
                  <option value="Countryside">Countryside</option>
                  <option value="Treehouse">Treehouse</option>
                  <option value="Trending">Trending</option>
                  <option value="Tropical">Tropical</option>
                  <option value="National Parks">National parks</option>
                  <option value="Casties">Casties</option>
                  <option value="Camping">Camping</option>
                  <option value="Top Of The World">Top of the world</option>
                  <option value="Luxe">Luxe</option>
                  <option value="Iconic Cities">Iconic cities</option>
                  <option value="Earth Homes">Earth homes</option>
                </select>
              </div>
              <div class="row">
                <div class="mb-3 col-md-4">
                  <label for="price" class="form-label">Price</label>
                  <div class="input-group mb-3">
                    <span class="input-group-text">₹</span>
                    <input type="number" value="${
                      listing.price
                    }" name="price" class="form-control" required>
                    <span class="input-group-text">.00</span>
                  </div>
                  <div class="invalid-feedback">Price is required.</div>
                </div>
                <div class="mb-3 col-md-8">
                  <label for="country" class="form-label">Country</label>
                  <input type="text" value="${
                    listing.country
                  }" name="country" class="form-control" required>
                  <div class="invalid-feedback">Country is required.</div>
                </div>
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input type="text" value="${
                  listing.location
                }" name="location" class="form-control" required>
                <div class="invalid-feedback">Location is required.</div>
              </div>
              <button type="submit" class="btn btn-success mb-3">Edit</button>
            </form>
             <div id="loading" class="loading-overlay align-items-center justify-content-center" style="display: none;">
              <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <span class="ms-2 ">Editing...</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const editForm = document.getElementById(
      "editForm"
    ) as HTMLFormElement | null;
    const imageInput = document.getElementById(
      "imageInput"
    ) as HTMLInputElement | null;
    const imagePreview = document.getElementById(
      "imagePreview"
    ) as HTMLDivElement | null;
    const loadingScreen = document.getElementById(
      "loading"
    ) as HTMLDivElement | null;

    if (imageInput && imagePreview) {
      imageInput.addEventListener("change", () => {
        if (imageInput.files) {
          imagePreview.innerHTML = ""; // Clear previous previews
          Array.from(imageInput.files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imgElement = document.createElement("img");
              imgElement.src = e.target?.result as string;
              imgElement.classList.add("img-thumbnail", "mb-3");
              imgElement.style.width = "150px";
              imgElement.style.height = "auto";
              imagePreview.appendChild(imgElement);
            };
            reader.readAsDataURL(file);
          });
        }
      });
    }

    if (editForm) {
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);

        if (loadingScreen) {
          loadingScreen.style.display = "flex"; // Show loading screen
          container.style.opacity = "0.5"; // Dim the background
        }

        try {
          await axios.put(`/api/listings/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          if (loadingScreen) {
            loadingScreen.style.display = "none"; // Hide loading screen
            container.style.opacity = "1"; // Restore background opacity
          }

          navigate(`/show/${id}`);
        } catch (error) {
          console.error("Error updating listing:", error);

          if (loadingScreen) {
            loadingScreen.style.display = "none"; // Hide loading screen
            container.style.opacity = "1"; // Restore background opacity
          }
        }
      });
    }
  } catch (error) {
    console.error("Error rendering edit page:", error);
  }
}
