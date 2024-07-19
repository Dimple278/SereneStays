import axios from "axios";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    try {
      const response = await axios.get(`/listings/${id}`);
      const listing = response.data;

      const form = document.getElementById(
        "editListingForm"
      ) as HTMLFormElement;

      (document.getElementById("listingId") as HTMLInputElement).value =
        listing.id;
      (document.getElementById("listingTitle") as HTMLInputElement).value =
        listing.title;
      (
        document.getElementById("listingDescription") as HTMLInputElement
      ).value = listing.description;
      (document.getElementById("listingImage") as HTMLInputElement).value =
        listing.image;
      (document.getElementById("listingPrice") as HTMLInputElement).value =
        listing.price;
      (document.getElementById("listingLocation") as HTMLInputElement).value =
        listing.location;
      (document.getElementById("listingCountry") as HTMLInputElement).value =
        listing.country;

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const updatedListing = {
          title: formData.get("title"),
          description: formData.get("description"),
          image: formData.get("image"),
          price: parseFloat(formData.get("price") as string),
          location: formData.get("location"),
          country: formData.get("country"),
        };

        try {
          await axios.put(`/listings/${id}`, updatedListing, {
            headers: { "Content-Type": "application/json" },
          });
          window.location.href = `/src/pages/show.html?id=${id}`;
        } catch (error) {
          console.error("There was an error updating the listing:", error);
        }
      });
    } catch (error) {
      console.error("There was an error fetching the listing:", error);
    }
  }
});
