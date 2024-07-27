export function renderFilterModal(container: HTMLElement) {
  container.innerHTML += `
    <div class="modal fade" id="filterModal" tabindex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="filterModalLabel">Filters</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="filterForm">
              <div class="mb-3">
                <label for="minPrice" class="form-label">Min Price</label>
                <input type="number" class="form-control" id="minPrice" name="minPrice">
              </div>
              <div class="mb-3">
                <label for="maxPrice" class="form-label">Max Price</label>
                <input type="number" class="form-control" id="maxPrice" name="maxPrice">
              </div>
              <div class="mb-3">
                <label for="country" class="form-label">Country</label>
                <input type="text" class="form-control" id="country" name="country">
              </div>
              <button type="submit" class="btn btn-danger" data-bs-dismiss="modal" id="applyFilters">Show Listings</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}
