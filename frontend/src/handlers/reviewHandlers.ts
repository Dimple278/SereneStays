import { IReview } from "../interfaces/reviews";
import { navigate } from "../main";
import { deleteReview, updateReview } from "../api/reviewAPI";

export function attachDeleteReviewListeners(listingId: string) {
  const deleteReviewForms = document.querySelectorAll(".delete-review-form");
  deleteReviewForms.forEach((form) =>
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const reviewId = (event.target as HTMLFormElement).dataset.reviewId;
      if (reviewId) {
        await deleteReview(listingId, reviewId);
        navigate(`/show/${listingId}`);
      } else {
        console.error("Review ID is undefined");
      }
    })
  );
}

export function attachEditReviewListeners(listingId: string) {
  const editReviewButtons = document.querySelectorAll(".edit-review-button");
  editReviewButtons.forEach((button) =>
    button.addEventListener("click", (event) => {
      const buttonElement = event.currentTarget as HTMLButtonElement;
      const reviewId = buttonElement.dataset.reviewId;
      const reviewRating = buttonElement.dataset.reviewRating;
      const reviewComment = buttonElement.dataset.reviewComment;

      const editReviewForm = document.getElementById(
        "edit-review-form"
      ) as HTMLFormElement;
      const editCommentTextarea = editReviewForm.querySelector(
        "#edit-comment"
      ) as HTMLTextAreaElement;
      const editRatingInputs = editReviewForm.querySelectorAll(
        "input[name='review[rating]']"
      ) as NodeListOf<HTMLInputElement>;

      editCommentTextarea.value = reviewComment || "";
      editRatingInputs.forEach((input) => {
        input.checked = input.value === reviewRating;
      });

      editReviewForm.dataset.reviewId = reviewId || "";

      editReviewForm.addEventListener(
        "submit",
        async (event) => {
          event.preventDefault();
          await updateReview(listingId, reviewId!);
          navigate(`/show/${listingId}`);
        },
        { once: true }
      );
    })
  );
}

export function renderReviewsList(reviews: IReview[], currUser: any) {
  return `
    <div class="row m-1 review-main">
      ${reviews
        .map(
          (review: IReview) => `
            <div class="card col-xs-4 col-sm-12 col-md-12 col-lg-5 review-lg">
              <div class="card-body mb-2 review-card">
                <p class="starability-result" data-rating="${
                  review.rating
                }"></p>
                <span style="max-width: 80vw;">
                  <h5 class="card-title"><b><i><a href="#" class="author-link" data-author-id="${
                    review.authorId
                  }">@${review.authorName}</a></i></b> &nbsp; :</h5><br>
                  <p class="card-text mb-1 review-comment">${review.comment}</p>
                </span>
              </div>
              ${
                currUser && currUser.id == review.authorId
                  ? renderReviewActions(review)
                  : ""
              }
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderReviewActions(review: IReview) {
  return `
    <div class="d-flex justify-content-between">
      <button type="button" class="btn btn-sm btn-primary edit-review-button" data-bs-toggle="modal" data-bs-target="#editReviewModal" data-review-id="${review.id}" data-review-rating="${review.rating}" data-review-comment="${review.comment}">
        <i class="fa-solid fa-edit"></i>
      </button>
      <form class="delete-review-form" data-review-id="${review.id}">
        <button type="submit" class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></button>
      </form>
    </div>
  `;
}

export function attachAuthorLinkListeners() {
  const authorLinks = document.querySelectorAll(".author-link");
  authorLinks.forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const authorId = (event.currentTarget as HTMLAnchorElement).dataset
        .authorId;
      if (authorId) {
        navigate(`/user/${authorId}`);
      }
    })
  );
}
