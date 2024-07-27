import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export async function renderMap(
  container: HTMLElement,
  location: string,
  title: string
) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
      )}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();

    if (data.features.length > 0) {
      const coordinates = data.features[0].center;

      // Initialize the map
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [coordinates[0], coordinates[1]],
        zoom: 12,
      });

      // Add a marker
      new mapboxgl.Marker()
        .setLngLat([coordinates[0], coordinates[1]])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${title}</h3>`))
        .addTo(map);
      console.log(title);
    } else {
      console.error("Geocoding API error:", data.message);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
}
