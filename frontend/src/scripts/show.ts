import axios from "axios";
import { loadCss } from "../utils/loadCss";
import { renderListing } from "../components/renderListing";
import { renderReviews } from "../components/renderReviews";
import { renderBookingForm } from "../components/renderBookingForm";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

async function getCoordinates(
  location: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
      )}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = response.data;

    if (data.features.length > 0) {
      const coordinates = data.features[0].center;
      return {
        lng: coordinates[0],
        lat: coordinates[1],
      };
    } else {
      console.error("Geocoding API error:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

export async function renderShowPage(container: HTMLElement, id: string) {
  try {
    const listingResponse = await axios.get(`/api/listings/${id}`);
    const reviewsResponse = await axios.get(`/api/reviews`);
    const listing = listingResponse.data;
    const reviews = reviewsResponse.data;

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
        <div class="map-container" id = "map-container">
          <p class="map-title">Where you'll be &nbsp;<i class="fa-solid fa-location-crosshairs"></i></p>
          <div id="map"></div>
        </div>
      </div>
    `;

    const showBody = container.querySelector(".show-body") as HTMLElement;

    renderListing(showBody, listing);
    renderReviews(showBody, reviews);
    renderBookingForm(showBody, id, listing.price);

    // Get coordinates from location
    const coordinates = await getCoordinates(listing.location);

    if (coordinates) {
      // Initialize the map
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [coordinates.lng, coordinates.lat],
        zoom: 12,
      });

      // Add a marker
      new mapboxgl.Marker()
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${listing.title}</h3>`)) // add popup if needed
        .addTo(map);
    } else {
      console.error(
        "Could not get coordinates for location:",
        listing.location
      );
    }
  } catch (error) {
    console.error("Error fetching listing details:", error);
  }
}
