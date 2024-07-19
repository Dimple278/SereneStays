interface Listing {
  id: string;
  title: string;
}

export async function fetchListings() {
  try {
    const response = await fetch("/listings");
    const listings: Listing[] = await response.json();
    console.log("Fetched listings:", listings);
    renderListings(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

function renderListings(listings: Listing[]) {
  const listingsElement = document.getElementById("listings");
  if (listingsElement) {
    listingsElement.innerHTML = listings
      .map(
        (listing) => `
            <li><a href="/src/pages/show.html?id=${listing.id}">${listing.title}</a></li>
        `
      )
      .join("");
  }
}
