import { navigate } from "../main";
import { IListing } from "../interfaces/listing";
import { confirmDialog } from "../utils/confirmDialogBox";
import { deleteListing } from "../api/listings";
import { getCurrUser } from "../api/getCurrUser";

export async function renderShowListing(
  container: HTMLElement,
  listing: IListing
) {
  const images = listing.images;
  const currUser = await getCurrUser();
  const imageSlides = images
    .map(
      (image, index) => `
    <div class="carousel-item${index === 0 ? " active" : ""}">
      <img src="${image}" class="rounded d-block w-100" alt="listing_image" style="height: 450px; object-fit: cover;">
    </div>
  `
    )
    .join("");
  container.innerHTML += `
    <div class="col-8 offset-2">
      <h3 class="ms-3">${listing.title}</h3>
    </div>
    <div class="card col-8 offset-2 show-card listing-card">
      <div id="carouselExampleControls" class="carousel slide custom-carousel">
        <div class="carousel-inner">
          ${imageSlides}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div class="card-body ms-1 mt-3 custom-card-body">
        <p class="card-text"><b>Owned by :</b> <b><i><a href="#" id="ownerLink">@${
          listing.ownerName
        }</a></i></b></p>
        <p class="card-text"><b>Description :</b> ${listing.description}</p>
        <p class="card-text"><b>Price :</b> &#8377; ${listing.price.toLocaleString(
          "en-IN"
        )}</p>
        <p class="card-text"><strong>Location:</strong> ${listing.location}</p>
        <p class="card-text"><strong>Country:</strong> ${listing.country}</p>
         ${
           currUser && currUser.id == listing.ownerId
             ? `
        <div class="d-flex justify-content-between">
          <button id="editButton" class="btn btn-primary">
            <i class="fa-solid fa-edit"></i> Edit
          </button>
          <form id="deleteForm" method="POST" action="#">
            <button type="submit" id="deleteButton" class="btn btn-danger">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </form>
        </div>
      </div>
       `
             : ""
         }
    </div>
    <!-- Divider Section -->
    <hr class="my-4">
   
  `;

  const editButton = document.querySelector("#editButton");
  if (editButton) {
    editButton.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(`/edit/${listing.id}`);
    });
  }

  const deleteForm = document.getElementById("deleteForm") as HTMLFormElement;
  if (deleteForm) {
    deleteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const confirmed = await confirmDialog(
        "Are you sure you want to delete this listing?"
      );
      if (confirmed) {
        await deleteListing(listing.id);
        navigate(`/listings`);
      }
    });
  }

  const ownerLink = document.getElementById("ownerLink");
  if (ownerLink) {
    ownerLink.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(`/user/${listing.ownerId}`);
    });
  }
}
