import { deleteListing, fetchListingsByCategory } from "../../api/listings";
import { setupPagination } from "../../handlers/paginationHandler";
import { IListing } from "../../interfaces/listing";
import { navigate } from "../../main";
import { state, updateState } from "../../state"; // Make sure to import state management

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
        <th>Owner ID</th>
        <th>Title</th>
        <th>Actions</th>
      </tr>
    `;

    const tbody = document.createElement("tbody");

    listings.forEach((listing: IListing) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td >${listing.id}</td>
        <td >${listing.ownerName}</td>
        <td class="listing-title" data-id="${listing.id}" style="cursor:pointer;">${listing.title}</td>
        <td>
         <button class="btn btn-sm btn-primary edit" data-id="${listing.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger delete" data-id="${listing.id}">
            <i class="fas fa-trash-alt"></i>
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
        await deleteListing(id);
        alert("Listing deleted");
        navigate("/dashboard");
      }
    });
  });
}
