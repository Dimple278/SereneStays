import { renderShowPage } from "./show";

export async function renderEditPage(container: HTMLElement, id: string) {
  try {
    const response = await fetch(`/api/listings/${id}`);
    const listing = await response.json();

    container.innerHTML = `
      <h3>Edit Listing</h3>
      <form id="editForm">
        <input type="text" name="title" value="${listing.title}" placeholder="Enter title" />
        <br /><br />
        <textarea name="description" placeholder="Enter description">${listing.description}</textarea>
        <br /><br />
        <input type="text" name="image" value="${listing.image}" placeholder="Enter image URL/Link" />
        <br /><br />
        <input type="number" name="price" value="${listing.price}" placeholder="Enter the price" />
        <br /><br />
        <input type="text" name="location" value="${listing.location}" placeholder="Enter the location" />
        <br /><br />
        <input type="text" name="country" value="${listing.country}" placeholder="Enter the country" />
        <button type="submit">Save</button>
      </form>
    `;

    const editForm = document.getElementById("editForm") as HTMLFormElement;
    if (editForm) {
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);
        const updatedListing = {
          title: formData.get("title"),
          description: formData.get("description"),
          image: formData.get("image"),
          price: formData.get("price"),
          location: formData.get("location"),
          country: formData.get("country"),
        };

        await fetch(`/api/listings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedListing),
        });

        window.history.pushState({}, "", `/show/${id}`);
        renderShowPage(container, id);
      });
    }
  } catch (error) {
    console.error("Error rendering edit page:", error);
  }
}
