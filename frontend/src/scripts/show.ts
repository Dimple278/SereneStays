import axios from "axios";
import { renderEditPage } from "./edit";
import { loadCss } from "../utils/loadCss";
import { navigate } from "../main";

export async function renderShowPage(container: HTMLElement, id: string) {
  try {
    const listingResponse = await axios.get(`/api/listings/${id}`);
    const reviewsResponse = await axios.get(`/api/reviews`);
    const listing = listingResponse.data;
    const review = reviewsResponse.data;
    console.log("Review:", review);

    loadCss("/src/styles/show.css");

    container.innerHTML = `
      <style>
        @media (max-width:768px) {
          .alert {
            left: 17%;
          }
        }
      </style>
     
      <div class="row mt-3 show-main">
        <div class="show-body">
          <div class="col-8 offset-2">
            <h3 class="ms-3">${listing.title}</h3>
          </div>
          <div class="card col-8 offset-2 show-card listing-card">
            <div class="show-card-img">
              <img src="${
                listing.images
              }" class="card-img-top show-img" alt="listing_image">
            </div>
            <div class="card-body ms-1">
              <p class="card-text"><b>Owned by :</b> <b><i>@${
                // listing.owner.name
                1
              }</i></b></p>
              <p class="card-text"><b>Description :</b> ${
                listing.description
              }</p>
              <p class="card-text"><b>Price :</b> &#8377; ${listing.price.toLocaleString(
                "en-IN"
              )}</p>
          <p class="card-text"><strong>Location:</strong> ${
            listing.location
          }</p>
          <p class="card-text"><strong>Country:</strong> ${listing.country}</p>
          <button id="editButton" class="btn btn-primary">Edit</button>
          <form id="deleteForm" method="POST" action="#" class="mt-3">
            <button type="submit" id="deleteButton" class="btn btn-danger">Delete this listing</button>
          </form>
        </div>
      </div>
      <div class="col-8 offset-2 mt-3">
            <h4>Reviews</h4>
            <div id="reviewsContainer">
              ${review
                .map(
                  (review) => `
                <div class="card mb-3">
                  <div class="card-body">
                    <p class="card-text"><strong>${review.authorId}:</strong> ${
                    review.comment
                  }</p>
                    <p class="card-text"><strong>Rating:</strong> ${
                      review.rating
                    }</p>
                    <p class="card-text"><strong>Posted on:</strong> 
                    ${
                      // new Date(
                      //   review.created_at
                      // ).toLocaleDateString()
                      1
                    }
                    </p>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
    `;

    const editButton = document.querySelector("#editButton");
    if (editButton) {
      editButton.addEventListener("click", (event) => {
        event.preventDefault();
        navigate(`/edit/${id}`);
      });
    }

    const deleteForm = document.getElementById("deleteForm") as HTMLFormElement;
    if (deleteForm) {
      deleteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await fetch(`/api/listings/${id}`, { method: "DELETE" });
        navigate(`/listings`);
      });
    }
  } catch (error) {
    console.error("Error fetching listing details:", error);
  }
}
