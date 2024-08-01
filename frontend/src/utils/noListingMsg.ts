export function createNoListingsMessage(category: string): string {
  return `
      <div class="col-12 my-5">
        <div class="text-center p-5 bg-light rounded-3 shadow-sm">
          <i class="far fa-frown fa-5x mb-4 text-danger"></i>
          <h2 class="display-6 fw-bold text-danger mb-3">Oops! No listings found</h2>
          <p class="lead mb-4 ">We couldn't find any listings for "${category}".</p>
          <p class="text-muted mb-4">Try adjusting your search or filters to find more options.</p>
        </div>
      </div>
    `;
}
