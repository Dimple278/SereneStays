import axios from "axios";
import { fetchListings, renderListings } from ".";
import { renderEditPage } from "./edit";
// import { renderEditPage } from "../components/editFrom/edit";

export async function renderShowPage(container: HTMLElement, id: string) {
  try {
    const response = await axios.get(`/api/listings/${id}`);
    const listing = response.data;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3>${listing.title}</h3>
        </div>
        <div class="card-body">
          <img src="${
            listing.image
          }" class="card-img-top mb-3" alt="listing_image">
          <p class="card-text"><strong>Description:</strong> ${
            listing.description
          }</p>
          <p class="card-text"><strong>Price:</strong> &#8377;${listing.price.toLocaleString(
            "en-IN"
          )}</p>
          <p class="card-text"><strong>Location:</strong> ${
            listing.location
          }</p>
          <p class="card-text"><strong>Country:</strong> ${listing.country}</p>
          <button id="editButton" class="btn btn-primary">Edit</button>
          <form id="deleteForm" method="POST" action="#" class="mt-3">
            <button type="submit" id="deleteButton" class="btn btn-danger">Delete this listing</button>
          </form>
        </div>
      </div>
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
