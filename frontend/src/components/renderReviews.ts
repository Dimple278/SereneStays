import axios from "axios";
import { IReview } from "../interfaces/reviews";
import { navigate } from "../main";
import { renderReviewForm, renderEditReviewModal } from "./reviewForm";
import { deleteReview, submitReviewForm, updateReview } from "../api/reviewAPI";

export async function renderReviews(
  container: HTMLElement,
  listingOwnerId: string,
  listingId: string
) {
  let reviews: IReview[] = [];

  try {
    const reviewsResponse = await axios.get(
      `/api/reviews/listing/${listingId}`
    );
    reviews = reviewsResponse.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  const token = localStorage.getItem("token");
  const currUser = token ? JSON.parse(atob(token.split(".")[1])) : null; // Decodes user info from token
  console.log("Current user:", currUser);

  const reviewsContainer = document.createElement("div");
  reviewsContainer.className = "col-8 offset-2 mt-3";
  reviewsContainer.innerHTML = `
    <h4>Reviews</h4>
    <hr class="mt-2">
    <div class="col-8 offset-2">
       ${currUser && currUser.id !== listingOwnerId ? renderReviewForm() : ""}
       ${
         reviews.length > 0
           ? renderReviewsList(reviews, currUser)
           : "<p>No reviews yet.</p>"
       }
    </div>
  `;

  container.appendChild(reviewsContainer);

  // Create and append the edit review modal
  const editReviewModal = renderEditReviewModal();
  document.body.appendChild(editReviewModal);

  if (currUser) {
    const leaveReviewForm = document.getElementById(
      "leave-review-form"
    ) as HTMLFormElement;
    leaveReviewForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await submitReviewForm(listingId);
      navigate(`/show/${listingId}`);
    });
  }

  attachEventListeners(currUser, listingId);
}

function renderReviewsList(reviews: IReview[], currUser: any) {
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
                  <h5 class="card-title">@${review.authorName} &nbsp; :</h5>
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

function attachEventListeners(currUser: any, listingId: string) {
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
