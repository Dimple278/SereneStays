import { navigate } from "../../main";
import { IListing } from "../../interfaces/listing";
import { getListingsByUserId } from "../../api/listings";
import { getCurrUser } from "../../api/getCurrUser";
import { IUser } from "../../interfaces/users";

export async function renderMyListings(container: HTMLElement, id?: string) {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("User not authenticated");
    return navigate("/login");
  }

  const currUser = (await getCurrUser()) as IUser;
  const userId = id || currUser.id; // Use provided id if it exists, otherwise use current user's id

  try {
    const listings = await getListingsByUserId(userId);

    // Create accordion HTML
    container.innerHTML = `
      <div class="accordion mt-3" id="listingsAccordion">
        ${listings
          .map(
            (listing: IListing, index: number) => `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                ${listing.title}
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
                <a href="#" class="btn btn-primary btn-sm mt-2 view-details" data-listing-id="${
                  listing.id
                }">View Details</a>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Add click event listeners to the "View Details" links
    const viewDetailsLinks = container.querySelectorAll(".view-details");
    viewDetailsLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const listingId = (event.target as HTMLElement).getAttribute(
          "data-listing-id"
        );
        navigate(`/show/${listingId}`);
      });
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    container.innerHTML =
      "<p>Error fetching listings. Please try again later.</p>";
  }
}
