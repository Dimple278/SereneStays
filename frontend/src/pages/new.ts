import axios from "axios";
import { navigate } from "../main";
import { compressImage } from "../utils/compressImage";
import { showCustomAlert } from "../utils/showCustomAlert";

export async function renderNewPage(container: HTMLElement) {
  container.innerHTML = `
      <div class="container mt-5">
        <div class="row">
          <div class="col-md-8 mx-auto">
            <h3>Create New Listing</h3>
            <form id="newForm" class="needs-validation" novalidate enctype="multipart/form-data">
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" name="title" class="form-control" required>
                <div class="valid-feedback">Title looks good!</div>
                <div class="invalid-feedback">Title is required.</div>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea cols="20" rows="3" name="description" class="form-control" required></textarea>
                <div class="invalid-feedback">Description is required.</div>
              </div>
              <div class="mb-3">
                <label for="images" class="form-label">Upload Images</label>
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
                    <input type="number" name="price" class="form-control" required>
                    <span class="input-group-text">.00</span>
                  </div>
                  <div class="invalid-feedback">Price is required.</div>
                </div>
                <div class="mb-3 col-md-8">
                  <label for="country" class="form-label">Country</label>
                  <input type="text" name="country" class="form-control" required>
                  <div class="invalid-feedback">Country is required.</div>
                </div>
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input type="text" name="location" class="form-control" required>
                <div class="invalid-feedback">Location is required.</div>
              </div>
              <button type="submit" class="btn btn-success mb-3">Create</button>
            </form>
            <div id="loading" class="position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow-sm" style="display: none; z-index: 9999;">
              <div class="text-center">
               <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
               </div>
                <p class="mt-2 mb-0">Creating your listing...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  const newForm = document.getElementById("newForm") as HTMLFormElement | null;
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
  const token = localStorage.getItem("token");
  if (newForm) {
    newForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(newForm);

      if (loadingScreen) {
        loadingScreen.style.display = "block"; // Show loading screen
      }

      try {
        // Compress images before sending
        const imageFiles = formData.getAll("images") as File[];
        const compressedImages = await Promise.all(
          imageFiles.map((file) => compressImage(file))
        );

        // Replace original images with compressed ones
        formData.delete("images");
        compressedImages.forEach((blob, index) => {
          formData.append("images", blob, `compressed_image_${index}.jpg`);
        });

        await axios.post("/api/listings", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (loadingScreen) {
          loadingScreen.style.display = "none"; // Hide loading screen
        }

        navigate(`/listings`);
        showCustomAlert({
          message: "Listing created successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error creating listing:", error);

        if (loadingScreen) {
          loadingScreen.style.display = "none"; // Hide loading screen
        }
      }
    });
  }
}
