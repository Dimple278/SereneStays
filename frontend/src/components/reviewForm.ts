export function renderReviewForm(): string {
  return `
      <p><b>Leave a Review &nbsp;<i class="fa-regular fa-pen-to-square"></i></b></p>
      <form id="leave-review-form" class="needs-validation" novalidate>
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
        <button type="submit" class="btn btn-success mb-3 styleBtn">Submit</button>
      </form>
    `;
}

export function renderEditReviewModal(): HTMLElement {
  const modal = document.createElement("div");
  modal.innerHTML = `
      <div class="modal fade" id="editReviewModal" tabindex="-1" aria-labelledby="editReviewModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editReviewModalLabel">Edit Review</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="edit-review-form" class="needs-validation" novalidate>
                <div class="mt-3">
                  <label class="form-label" for="edit-rating">Rating</label>
                  <fieldset class="starability-slot">
                    <input type="radio" id="edit-no-rate" class="input-no-rate" name="review[rating]" value="1" checked aria-label="No rating." />
                    <input type="radio" id="edit-rate1" name="review[rating]" value="1" />
                    <label for="edit-rate1" title="Terrible">1 star</label>
                    <input type="radio" id="edit-rate2" name="review[rating]" value="2" />
                    <label for="edit-rate2" title="Not good">2 stars</label>
                    <input type="radio" id="edit-rate3" name="review[rating]" value="3" />
                    <label for="edit-rate3" title="Average">3 stars</label>
                    <input type="radio" id="edit-rate4" name="review[rating]" value="4" />
                    <label for="edit-rate4" title="Very good">4 stars</label>
                    <input type="radio" id="edit-rate5" name="review[rating]" value="5" />
                    <label for="edit-rate5" title="Amazing">5 stars</label>
                  </fieldset>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="edit-comment">Comment</label>
                  <textarea class="form-control" name="review[comment]" id="edit-comment" cols="30" rows="3" required></textarea>
                  <div class="invalid-feedback">Please add some comments for review</div>
                </div>
                <button type="submit" data-bs-dismiss="modal" class="btn btn-success mb-3 styleBtn">Update</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  return modal;
}
