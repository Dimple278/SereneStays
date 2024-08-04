import { deleteListing, fetchListingsByCategory } from "../../api/listings";
import { setupPagination } from "../../handlers/paginationHandler";
import { IListing } from "../../interfaces/listing";
import { navigate } from "../../main";
import { showCustomAlert } from "../../utils/showCustomAlert";
import { showCustomConfirm } from "../../utils/showCustomConfirm";

/**
 * Renders all listings in a paginated table format.
 *
 * @param {HTMLElement} container - The container element where the listings will be rendered.
 * @param {number} [page=1] - The current page number for pagination.
 */
export async function renderAllListings(
  container: HTMLElement,
  page: number = 1
) {
  // Clear the container
  container.innerHTML = "";

  const category = "ALL";
  const limit = 10;

  try {
    const { listings, totalCount } = await fetchListingsByCategory(
      category,
      page,
      limit
    );

    // Create table structure
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "mt-4");

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Owner</th>
        <th>Title</th>
        <th>Actions</th>
      </tr>
    `;

    const tbody = document.createElement("tbody");

    listings.forEach((listing: IListing) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${listing.id}</td>
        <td>${listing.ownerName}</td>
        <td class="listing-title" data-id="${listing.id}" style="cursor:pointer;">${listing.title}</td>
        <td>
          <button class="btn btn-sm btn-primary edit" data-id="${listing.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger delete" data-id="${listing.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    // Add event listeners for edit and delete icons
    setupActionListeners(container);

    // Setup pagination
    setupPagination(container, totalCount, page, (newPage) => {
      renderAllListings(container, newPage);
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    container.innerHTML = '<p class="text-danger">Failed to load listings.</p>';
  }
}

/**
 * Sets up click event listeners for listing actions such as view, edit, and delete.
 *
 * @param {HTMLElement} container - The container element where the event listeners will be added.
 */
function setupActionListeners(container: HTMLElement) {
  container.querySelectorAll(".listing-title").forEach((title) => {
    title.addEventListener("click", (event) => {
      const id = (event.currentTarget as HTMLElement).getAttribute("data-id");
      navigate(`/show/${id}`);
    });
  });

  container.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const id = (event.currentTarget as HTMLElement).getAttribute("data-id");
      navigate(`/edit/${id}`);
    });
  });

  container.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const id = (event.currentTarget as HTMLElement).getAttribute("data-id");
      if (id) {
        showCustomConfirm({
          message: "Are you sure you want to delete this listing?",
          onConfirm: async () => {
            await deleteListing(id);
            showCustomAlert({
              message: "Listing deleted successfully!",
            });
            navigate("/dashboard");
          },
        });
      }
    });
  });
}
