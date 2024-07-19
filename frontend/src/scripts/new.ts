import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newListingForm") as HTMLFormElement;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const listing = {
      title: formData.get("title"),
      description: formData.get("description"),
      image: formData.get("image"),
      price: parseFloat(formData.get("price") as string),
      location: formData.get("location"),
      country: formData.get("country"),
    };

    try {
      await axios.post("http://localhost:3000/listings", listing, {
        headers: { "Content-Type": "application/json" },
      });
      window.location.href = "/";
    } catch (error) {
      console.error("There was an error creating the listing:", error);
    }
  });
});
