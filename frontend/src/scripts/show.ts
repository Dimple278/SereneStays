import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    try {
      const response = await axios.get(`/listings/${id}`);
      const listing = response.data;

      const listingDetails = document.getElementById("listingDetails");
      if (listingDetails) {
        listingDetails.innerHTML = `
          <li>Title: ${listing.title}</li>
          <li>Description: ${listing.description}</li>
          <li><img src="${listing.image}"> </li>
          <li>Price: ${listing.price}</li>
          <li>Location: ${listing.location}</li>
          <li>Country: ${listing.country}</li>
        `;
      }

      const editButton = document.getElementById("editButton");
      if (editButton) {
        editButton.addEventListener("click", () => {
          window.location.href = `/src/pages/edit.html?id=${id}`;
        });
      }

      const deleteForm = document.getElementById(
        "deleteForm"
      ) as HTMLFormElement;
      if (deleteForm) {
        deleteForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          try {
            await axios.delete(`/listings/${id}`);
            window.location.href = `/src/pages/index.html`;
          } catch (error) {
            console.error("There was an error deleting the listing:", error);
          }
        });
      }
    } catch (error) {
      console.error("There was an error fetching the listing:", error);
    }
  }
});
