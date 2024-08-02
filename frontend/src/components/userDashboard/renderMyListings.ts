import axios from "axios";
import { navigate } from "../../main";
import { IListing } from "../../interfaces/listing";

export async function renderMyListings(container: HTMLElement) {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User not authenticated");
    return navigate("/login");
  }

  // Decode token to get user ID
  const currUser = JSON.parse(atob(token.split(".")[1]));
  const userId = currUser.id;

  try {
    // Fetch listings for the current user
    const response = await axios.get(`/api/listings/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const listings: IListing[] = response.data;

    // Create accordion HTML
    container.innerHTML = `
      <div class="accordion mt-3" id="listingsAccordion">
        ${listings
          .map(
            (listing, index) => `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                <span class="listing-title" id="title${index}">${
              listing.title
            }</span>
              </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#listingsAccordion">
              <div class="accordion-body">
                <div class="listing-details">
                  <p><strong>Description:</strong> ${listing.description}</p>
                  <p><strong>Price:</strong> ₹${listing.price}</p>
                  <p><strong>Location:</strong> ${listing.location}</p>
                  <p><strong>Category:</strong> ${listing.category}</p>
                  ${listing.images
                    .map(
                      (img: string) => `
                    <img src="${img}" alt="Listing Image" class="img-thumbnail mb-3" style="width: 150px; height: auto;">
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Add click event listeners to the titles to navigate to /show/:id
    listings.forEach((listing, index) => {
      const titleElement = document.getElementById(`title${index}`);
      if (titleElement) {
        titleElement.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent the accordion from toggling
          navigate(`/show/${listing.id}`);
        });
      }
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    container.innerHTML =
      "<p>Error fetching listings. Please try again later.</p>";
  }
}
