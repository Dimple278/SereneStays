import { loadCss } from "../utils/loadCss";
import { renderShowListing } from "../components/renderShowListing";
import { renderReviews } from "../components/renderReviews";
import { renderBookingForm } from "../components/renderBookingForm";
import { renderMap } from "../components/renderMap";
import { getListingById } from "../api/listings";

export async function renderShowPage(container: HTMLElement, id: string) {
  try {
    const listing = await getListingById(id);

    loadCss("/src/styles/show.css");

    container.innerHTML = `
      <style>
        @media (max-width:768px) {
          .alert {
            left: 17%;
          }
        }
      </style>
      
       <div class="row mt-3 show-main">
        <div class="show-body"></div>
        <div class="map-container" id="map-container">
          <p class="map-title">Where you'll be &nbsp;<i class="fa-solid fa-location-crosshairs"></i></p>
          <div id="map"></div>
        </div>
      </div>
    `;

    const showBody = container.querySelector(".show-body") as HTMLElement;

    await renderShowListing(showBody, listing);
    await renderBookingForm(showBody, listing.ownerId, id, listing.price);
    renderReviews(showBody, listing.ownerId, id);

    // Get coordinates from location and render map
    await renderMap(container, listing.location, listing.title);
  } catch (error) {
    console.error("Error fetching listing details:", error);
  }
}
