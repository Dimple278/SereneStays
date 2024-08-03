import axios from "axios";
import { showCustomAlert } from "../utils/showCustomAlert";

// Helper function to get the authorization token
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

// Set the Authorization header
function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function submitReviewForm(listingId: string) {
  const form = document.getElementById("leave-review-form") as HTMLFormElement;
  const formData = new FormData(form);

  const review = {
    rating: formData.get("review[rating]"),
    comment: formData.get("review[comment]"),
  };

  try {
    await axios.post(`/api/reviews/listing/${listingId}`, review, {
      headers: getAuthHeaders(),
    });
    showCustomAlert({
      message: "Review Added successfully!",
      type: "success",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
  }
}

export async function updateReview(listingId: string, reviewId: string) {
  const form = document.getElementById("edit-review-form") as HTMLFormElement;
  const formData = new FormData(form);

  const review = {
    rating: formData.get("review[rating]"),
    comment: formData.get("review[comment]"),
  };

  try {
    await axios.put(`/api/reviews/${reviewId}`, review, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error updating review:", error);
  }
}

export async function deleteReview(listingId: string, reviewId: string) {
  try {
    await axios.delete(`/api/reviews/${reviewId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting review:", error);
  }
}

export async function getReviewsByListingId(listingId: string) {
  try {
    const reviewsResponse = await axios.get(
      `/api/reviews/listing/${listingId}`
    );
    const reviews = reviewsResponse.data;
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
}
