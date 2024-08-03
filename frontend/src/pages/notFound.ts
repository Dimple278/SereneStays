export function renderNotFoundPage(container: HTMLElement) {
  container.innerHTML = `
      <div class="container-fluid bg-light min-vh-100 d-flex align-items-center">
        <div class="row w-100 justify-content-center">
          <div class="col-md-6 text-center">
            <div class="card shadow-sm border-0">
              <div class="card-body p-5">
                <i class="fas fa-map-signs fa-5x mb-4" style="color: #FF5A5F;"></i>
                <h1 class="display-4 fw-bold mb-4" style="color: #484848;">Oops! Page Not Found</h1>
                <p class="lead mb-5" style="color: #767676;">We couldn't find the page you're looking for. It seems you've ventured off the beaten path!</p>
                <a href="/" class="btn btn-lg px-5 py-3 fw-bold" style="background-color: #FF5A5F; color: white;">
                  <i class="fas fa-home me-2"></i>Go Back Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}
