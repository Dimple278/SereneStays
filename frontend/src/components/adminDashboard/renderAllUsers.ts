import { deleteUser, fetchUsers } from "../../api/usersAPI";
import { setupPagination } from "../../handlers/paginationHandler";
import { IUser } from "../../interfaces/users";
import { navigate } from "../../main";
import { showCustomAlert } from "../../utils/showCustomAlert";
import { showCustomConfirm } from "../../utils/showCustomConfirm";

export async function renderAllUsers(container: HTMLElement, page: number = 1) {
  container.innerHTML = "";

  try {
    const response = await fetchUsers(page, 10);
    const { users, totalCount } = response;

    // Create table
    const table = document.createElement("table");
    table.className = "table table-hover table-striped";

    // Create table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    users.forEach((user: IUser) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${user.image}" alt="${user.name}" class="user-image rounded-circle" width="50" height="50"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Create a container for the table
    const tableContainer = document.createElement("div");
    tableContainer.className = "table-responsive";
    tableContainer.appendChild(table);

    container.appendChild(tableContainer);

    // Add event listeners for edit and delete buttons
    const editButtons = container.querySelectorAll(".edit-user");
    const deleteButtons = container.querySelectorAll(".delete-user");

    editButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.target as HTMLButtonElement;
        const userId = parseInt(
          target.closest("button")!.dataset.id as string,
          10
        );
        navigate(`/edit-profile/${userId}`);
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const target = event.target as HTMLButtonElement;
        const userId = target.closest("button")!.dataset.id as string;

        showCustomConfirm({
          message: "Are you sure you want to delete this user?",
          onConfirm: async () => {
            await deleteUser(userId);
            await renderAllUsers(container, page);
            showCustomAlert({
              type: "success",
              message: "User deleted successfully!",
            });
          },
        });
      });
    });

    // Setup pagination
    setupPagination(container, totalCount, page, async (newPage: number) => {
      await renderAllUsers(container, newPage);
    });
  } catch (error) {
    console.error("Failed to render users:", error);
    container.innerHTML =
      "<p class='text-danger'>Failed to load users. Please try again later.</p>";
  }
}
