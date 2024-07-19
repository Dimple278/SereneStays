import { fetchListings, renderListings } from ".";
import { renderEditPage } from "./edit";

export async function renderShowPage(container: HTMLElement, id: string) {
  try {
    const response = await fetch(`/api/listings/${id}`);
    const listing = await response.json();

    container.innerHTML = `
      <h3>Listing Details:</h3>
      <ul>
        <li>Title: ${listing.title}</li>
        <li>Description: ${listing.description}</li>
        <img src = " ${listing.image}"></li>
        <li>Price: ${listing.price}</li>
        <li>Location: ${listing.location}</li>
        <li>Country: ${listing.country}</li>
      </ul>
      <button id="editButton">Edit</button>
      <form id="deleteForm" method="POST" action="#">
        <button type="submit" id="deleteButton">Delete this listing</button>
      </form>
    `;

    const editButton = document.getElementById("editButton");
    if (editButton) {
      editButton.addEventListener("click", () => {
        window.history.pushState({}, "", `/edit/${id}`);
        renderEditPage(container, id);
      });
    }

    const deleteForm = document.getElementById("deleteForm") as HTMLFormElement;
    if (deleteForm) {
      deleteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await fetch(`/api/listings/${id}`, { method: "DELETE" });
        window.history.pushState({}, "", `/listings`);
        fetchListings().then((listings) => renderListings(container, listings));
      });
    }
  } catch (error) {
    console.error("Error fetching listing details:", error);
  }
}
