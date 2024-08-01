import { IListing } from "../interfaces/listing";
import { fetchListingsByCategory } from "../api/fetchListings";

export async function renderAllListings(container: HTMLElement) {
  // Clear the container
  container.innerHTML = "";

  // Fetch the listings
  const category = "ALL"; // Adjust as needed
  const page = 1;
  const limit = 10; // Adjust as needed

  try {
    const { listings } = await fetchListingsByCategory(category, page, limit);

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
        <td>${listing.id}</td>
        <td>${listing.ownerId}</td>
        <td>${listing.title}</td>
        <td>
          <i class="fas fa-edit text-primary edit-icon" data-id="${listing.id}" style="cursor: pointer;"></i>
          <i class="fas fa-trash-alt text-danger delete-icon" data-id="${listing.id}" style="cursor: pointer;"></i>
        </td>
      `;

      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    // Add event listeners for edit and delete icons
    container.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const id = (event.currentTarget as HTMLElement).getAttribute("data-id");
        // Handle edit action
        console.log(`Edit listing with id: ${id}`);
      });
    });

    container.querySelectorAll(".delete-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const id = (event.currentTarget as HTMLElement).getAttribute("data-id");
        // Handle delete action
        console.log(`Delete listing with id: ${id}`);
      });
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    container.innerHTML = '<p class="text-danger">Failed to load listings.</p>';
  }
}
