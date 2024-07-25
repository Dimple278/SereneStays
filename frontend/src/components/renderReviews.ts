export function renderReviews(
  container: HTMLElement,
  reviews: any[],
  currUser: any,
  listingId: string
) {
  const reviewsContainer = document.createElement("div");
  reviewsContainer.className = "col-8 offset-2 mt-3";
  reviewsContainer.innerHTML = `
    <h4>Reviews</h4>
    <hr class="mt-2">
    <div class="col-8 offset-2">
      ${
        currUser
          ? `
        <p><b>Leave a Review &nbsp;<i class="fa-regular fa-pen-to-square"></i></b></p>
        <form method="post" action="/listings/${listingId}/reviews" class="needs-validation" novalidate>
          <div class="mt-3">
            <label class="form-label" for="rating">Rating</label>
            <fieldset class="starability-slot">
              <input type="radio" id="no-rate" class="input-no-rate" name="review[rating]" value="1" checked aria-label="No rating." />
              <input type="radio" id="first-rate1" name="review[rating]" value="1" />
              <label for="first-rate1" title="Terrible">1 star</label>
              <input type="radio" id="first-rate2" name="review[rating]" value="2" />
              <label for="first-rate2" title="Not good">2 stars</label>
              <input type="radio" id="first-rate3" name="review[rating]" value="3" />
              <label for="first-rate3" title="Average">3 stars</label>
              <input type="radio" id="first-rate4" name="review[rating]" value="4" />
              <label for="first-rate4" title="Very good">4 stars</label>
              <input type="radio" id="first-rate5" name="review[rating]" value="5" />
              <label for="first-rate5" title="Amazing">5 stars</label>
            </fieldset>
          </div>
          <div class="mb-3">
            <label class="form-label" for="comment">Comment</label>
            <textarea class="form-control" name="review[comment]" id="comment" cols="30" rows="3" required></textarea>
            <div class="invalid-feedback">Please add some comments for review</div>
          </div>
          <button class="btn btn-success mb-3 styleBtn">Submit</button>
        </form>
      `
          : ""
      }
      ${
        reviews.length > 0
          ? `
        <p><b>All Reviews</b></p>
        <div class="row m-1 review-main">
          ${reviews
            .map(
              (review) => `
                <div class="card col-xs-4 col-sm-12 col-md-12 col-lg-5 review-lg">
                  <div class="card-body mb-2 review-card">
                    <p class="starability-result" data-rating="${
                      review.rating
                    }"></p>
                    <span style="max-width: 80vw;">
                      <h5 class="card-title">@${
                        // review.author.username
                        1
                      } &nbsp; :</h5>
                      <p class="card-text mb-1 review-comment">${
                        review.comment
                      }</p>
                    </span>
                  </div>
                  ${
                    currUser && currUser._id === review.authorId
                      ? `<form action="/listings/${listingId}/reviews/${review.id}?_method=DELETE" class="mb-1 review-del needs-validation" method="post">
                          <button class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></button>
                        </form>`
                      : ""
                  }
                </div>
              `
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `;
  container.appendChild(reviewsContainer);
}
