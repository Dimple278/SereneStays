export function renderReviews(container: HTMLElement, reviews: any[]) {
  const reviewsContainer = document.createElement("div");
  reviewsContainer.className = "col-8 offset-2 mt-3";
  reviewsContainer.innerHTML = `
      <h4>Reviews</h4>
      <div id="reviewsContainer">
        ${reviews
          .map(
            (review) => `
          <div class="card mb-3">
            <div class="card-body">
              <p class="card-text"><strong>${review.authorId}:</strong> ${review.comment}</p>
              <p class="card-text"><strong>Rating:</strong> ${review.rating}</p>
              <p class="card-text"><strong>Posted on:</strong> 1</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  container.appendChild(reviewsContainer);
}
