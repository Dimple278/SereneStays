import axios, { AxiosError } from "axios";
import { showCustomAlert } from "../utils/showCustomAlert";
import { IReview } from "../interfaces/reviews";
import { handleError } from "./handleError";

// Helper function to get the authorization token
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

// Set the Authorization header
function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function submitReviewForm(listingId: string): Promise<void> {
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
      message: "Review added successfully!",
      type: "success",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    showCustomAlert({
      message: "Failed to submit review. Please try again.",
      type: "danger",
    });
    throw handleError(error);
  }
}

export async function updateReview(
  listingId: string,
  reviewId: string
): Promise<void> {
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
    showCustomAlert({
      message: "Review updated successfully!",
      type: "success",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    showCustomAlert({
      message: "Failed to update review. Please try again.",
      type: "danger",
    });
    throw handleError(error);
  }
}

export async function deleteReview(
  listingId: string,
  reviewId: string
): Promise<void> {
  try {
    await axios.delete(`/api/reviews/${reviewId}`, {
      headers: getAuthHeaders(),
    });
    showCustomAlert({
      message: "Review deleted successfully!",
      type: "success",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    showCustomAlert({
      message: "Failed to delete review. Please try again.",
      type: "danger",
    });
    throw handleError(error);
  }
}

export async function getReviewsByListingId(
  listingId: string
): Promise<IReview[]> {
  try {
    const reviewsResponse = await axios.get(
      `/api/reviews/listing/${listingId}`
    );
    return reviewsResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        // If the status is 404 (Not Found), return an empty array
        console.log("No reviews found for this listing");
        return [];
      }
    }
    // For other types of errors, log, show alert, and throw
    console.error("Error fetching reviews:", error);
    showCustomAlert({
      message: "Failed to fetch reviews. Please try again.",
      type: "danger",
    });
    throw handleError(error);
  }
}
