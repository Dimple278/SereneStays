import axios from "axios";
import { fetchListings, renderListings } from ".";

export function renderNewPage(container: HTMLElement) {
  container.innerHTML = `
    <div class="row mt-0 mx-auto">
        <div class="col-md-8 mx-auto">
            <br><br>
            <h3>Create A New Listing</h3>
            <form id="newForm" class="needs-validation" novalidate enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" placeholder="Add A Catchy Title" name="title" class="form-control border border-black border-opacity-50" required>
                    <div class="valid-feedback">Title looks good!</div>
                    <div class="invalid-feedback">Title should be valid</div>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea cols="20" rows="3" placeholder="Enter Description" name="description" class="form-control border border-black border-opacity-50" required></textarea>
                    <div class="invalid-feedback">Please enter a short description.</div>
                </div>
                <div class="row mb-3">
                    <div class="col-10">
                        <label for="image" class="form-label">Upload Image</label>
                        <input type="text" name="image" class="form-control border border-black border-opacity-50" placeholder="Enter image URL/Link" required>
                    </div>
                    <div class="col-2">
                        <label class="form-control border border-white" style="margin-left: -15px;font-weight: 700;" for="verify">Verify</label>
                        <input type="checkbox" id="verify" class="form-btn btn ms-2 border border-black border-opacity-50" required style="height: 25px; width:25px;">
                        <div class="invalid-feedback">Verify</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="image" class="form-label">Update Image Preview</label><br>
                    <div id="imagePreview" class="listingImg">
                        <img src="/Icon/listing-img-pre.png" alt="demo">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="category" class="form-label">Choose Category</label>
                    <select id="category" name="category" class="form-select border border-black border-opacity-50 mb-2" multiple required style="font-size: .95rem;">
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
                    <div class="invalid-feedback">Choose category name</div>
                </div>
                <div class="row">
                    <div class="mb-3 col-md-4">
                        <label for="price" class="form-label">Price</label>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text">₹</span>
                            </div>
                            <input type="number" placeholder="Enter Price" name="price" class="form-control border border-black border-opacity-50" required>
                            <div class="input-group-append">
                              <span class="input-group-text">.00</span>
                            </div>
                        </div>
                        <div class="invalid-feedback">Price should be valid</div>
                    </div>
                    <div class="mb-3 col-md-8">
                        <label for="country" class="form-label">Country</label>
                        <input type="text" placeholder="Enter Country" name="country" class="form-control border border-black border-opacity-50" required>
                        <div class="invalid-feedback">Country name should be valid</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" placeholder="Enter Location" name="location" class="form-control border border-black border-opacity-50" required>
                    <div class="invalid-feedback">Location should be valid</div>
                </div>
                <button class="btn btn-success mb-3 styleBtn">Add</button>
            </form>
        </div>
    </div>
  `;

  const newForm = document.getElementById("newForm") as HTMLFormElement;
  if (newForm) {
    newForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(newForm);
      const newListing = {
        title: formData.get("title"),
        description: formData.get("description"),
        image: formData.get("image"),
        price: formData.get("price"),
        location: formData.get("location"),
        country: formData.get("country"),
        category: formData.get("category"),
      };

      await axios.post("/api/listings", newListing);

      window.history.pushState({}, "", `/listings`);
      fetchListings().then((listings) => renderListings(container, listings));
    });
  }
}
