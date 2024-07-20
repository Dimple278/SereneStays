import axios from "axios";
import { fetchListings, renderListings } from ".";

export function renderNewPage(container: HTMLElement) {
  container.innerHTML = `
    <h3>Add New Listing</h3>
    <form id="newForm">
      <input type="text" name="title" placeholder="Enter title" />
      <br /><br />
      <textarea name="description" placeholder="Enter description"></textarea>
      <br /><br />
      <input type="text" name="image" placeholder="Enter image URL/Link" />
      <br /><br />
      <input type="number" name="price" placeholder="Enter the price" />
      <br /><br />
      <input type="text" name="location" placeholder="Enter the location" />
      <br /><br />
      <input type="text" name="country" placeholder="Enter the country" />
      <button type="submit">Add</button>
    </form>
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
      };

      await axios.post("/api/listings", newListing);

      window.history.pushState({}, "", `/listings`);
      fetchListings().then((listings) => renderListings(container, listings));
    });
  }
}
