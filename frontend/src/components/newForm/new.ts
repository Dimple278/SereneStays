import axios from "axios";
import { fetchListings } from "../../utils/fetchListings";
import { renderListings } from "../../scripts";

export function renderNewPage(container: HTMLElement) {
  fetch("/src/components/newForm/newForm.html")
    .then((response) => response.text())
    .then((html) => {
      container.innerHTML = html;

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
            // category: formData.get("category"),
          };

          await axios.post("/api/listings", newListing);

          window.history.pushState({}, "", `/listings`);
          fetchListings().then((listings) =>
            renderListings(container, listings)
          );
        });
      }
    })
    .catch((error) => console.error("Error loading new form:", error));
}
