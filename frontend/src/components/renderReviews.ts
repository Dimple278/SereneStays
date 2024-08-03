import axios from "axios";
import { IReview } from "../interfaces/reviews";
import { navigate } from "../main";
import { renderReviewForm, renderEditReviewModal } from "./reviewForm";
import { submitReviewForm } from "../api/reviewAPI";
import {
  attachDeleteReviewListeners,
  attachEditReviewListeners,
  renderReviewsList,
  attachAuthorLinkListeners,
} from "../handlers/reviewHandlers";

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
  const currUser = token ? JSON.parse(atob(token.split(".")[1])) : null;
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

  attachDeleteReviewListeners(listingId);
  attachEditReviewListeners(listingId);
  attachAuthorLinkListeners();
}
