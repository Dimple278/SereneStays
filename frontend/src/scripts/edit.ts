import axios from "axios";
import { renderShowPage } from "./show";

export async function renderEditPage(container: HTMLElement, id: string) {
  try {
    const response = await axios.get(`/api/listings/${id}`);
    const listing = response.data;

    container.innerHTML = `
      <div class="row mt-0 mx-auto">
        <div class="col-md-8 mx-auto">
          <br><br>
          <h3>Edit Your Listing</h3>
          <form id="editForm" method="post" action="/listings/${listing._id}?_method=PUT" class="needs-validation" novalidate enctype="multipart/form-data">
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" value="${listing.title}" name="listing[title]" class="form-control border border-black border-opacity-50" required>
              <div class="valid-feedback">Title looks good!</div>
              <div class="invalid-feedback">Title should be valid</div>
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea cols="20" rows="3" name="listing[description]" class="form-control border border-black border-opacity-50" required>${listing.description}</textarea>
              <div class="invalid-feedback">Please enter a short description.</div>
            </div>
            <div class="mb-3">
              <label for="image" class="form-label">Original Image Preview</label><br>
              <img src="${listing.image}" alt="Original Image" class="listingImg">
            </div>
            <div class="row mb-3">
              <div class="col-10">
                <label for="image" class="form-label">Upload New Image</label>
                <input type="file" name="listing[image]" class="form-control border border-black border-opacity-50 imageInput" id="verify-img">
                <p id="errorContainer"></p>
              </div>
              <div class="col-2">
                <label class="form-control border border-white" style="margin-left: -15px;font-weight: 700;" for="verify">Verify</label>
                <input type="checkbox" checked id="verify" class="form-btn btn ms-2 border border-black border-opacity-50" required style="height: 25px; width:25px;">
                <div class="invalid-feedback">Verify</div>
              </div>
            </div>
            <div class="mb-3">
              <label for="image" class="form-label">Update Image Preview</label><br>
              <div id="imagePreview" class="listingImg">
                <img src="/Icon/listing-img-pre.png" alt="demo">
              </div>
            </div>
            <div class="m-b3">
              <label for="category-added" class="form-label">Previous Category</label>
            </div>
            <div class="m-b3">
              <label for="category" class="form-label">Choose Category</label>
              <div class="category-choose">
                <p><b>Single choose :</b> Click &nbsp;&nbsp;</p>
                <p><b>Multiple choose :</b> Ctrl + Click</p>
              </div>
              <select id="category" name="listing[category]" class="form-select border border-black border-opacity-50 mb-2" multiple style="font-size: .95rem;">
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
                  <div class="input-group-prepend">
                    <span class="input-group-text">₹</span>
                  </div>
                  <input type="number" value="${listing.price}" name="listing[price]" class="form-control border border-black border-opacity-50" required>
                  <div class="input-group-append">
                    <span class="input-group-text">.00</span>
                  </div>
                </div>
                <div class="invalid-feedback">Price should be valid</div>
              </div>
              <div class="mb-3 col-md-8">
                <label for="country" class="form-label">Country</label>
                <input type="text" value="${listing.country}" name="listing[country]" class="form-control border border-black border-opacity-50" required>
                <div class="invalid-feedback">Country name should be valid</div>
              </div>
            </div>
            <div class="mb-3">
              <label for="location" class="form-label">Location</label>
              <input type="text" value="${listing.location}" name="listing[location]" class="form-control border border-black border-opacity-50" required>
              <div class="invalid-feedback">Location should be valid</div>
            </div>
            <button type="submit" class="btn btn-success mb-3 styleBtn">Edit</button>
          </form>
        </div>
      </div>
    `;

    const editForm = document.getElementById("editForm") as HTMLFormElement;
    if (editForm) {
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);

        // Log the FormData entries for debugging
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        try {
          const updatedListing = {
            title: formData.get("listing[title]"),
            description: formData.get("listing[description]"),
            // image: formData.get("listing[image]"),
            price: formData.get("listing[price]"),
            location: formData.get("listing[location]"),
            country: formData.get("listing[country]"),
            // category: formData.getAll("listing[category]"),
          };

          await axios.put(`/api/listings/${id}`, updatedListing);

          window.history.pushState({}, "", `/show/${id}`);
          renderShowPage(container, id);
        } catch (error) {
          console.error("Error updating listing:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error rendering edit page:", error);
  }
}
