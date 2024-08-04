# SereneStays
This project is a clone of the popular Airbnb platform, built using the PEN stack (PostgreSQL, Express, Node) with TypeScript. The application includes full CRUD functionality, user authentication and authorization, responsive design, and several advanced features such as image upload and resizing, interactive maps, and more.

## Features
* User Authentication and Authorization: Secure login and registration system with role-based access control (user and superadmin roles).
* Listings Management: Users can create, update, delete, and view property listings with multiple images.
* Booking System: Users can book listings, with the total price calculated based on the number of days and the listing price.
* Reviews: Users can leave reviews on listings, including comments and ratings.
* Interactive Maps: Listings are displayed on a map using the Mapbox API.
* Image Handling: Images are uploaded using Multer and Cloudinary, with resizing and compression handled by an HTML canvas.
* Responsive Design: Fully responsive layout using Bootstrap 5.3.
* Admin Dashboard: Superadmins can manage all users and listings from a dedicated dashboard.
* User Dashboard: Users can view and manage their profile, bookings, and listings.
* Search and Filter: Listings can be filtered by category, price range, and location. Real-time searching is enabled with a debouncer to optimize performance.
* Pagination: Listings and reviews are paginated for better user experience.
## Technologies Used
* Frontend: TypeScript, Bootstrap 5.3, Flatpickr, HTML Canvas, Font Awesome
* Backend: Node.js, Express.js, PostgreSQL, Knex.js
* APIs: Mapbox API, Cloudinary API
* Libraries: Multer for file uploads
## Installation
* Clone the repository: git clone https://github.com/dimple278/serenestays.git
* cd serenestays
* Install dependencies:
   npm install
* Set up environment variables:
Create a .env file in the root directory and add your configuration:

* npx knex migrate:latest
* npx knex seed:run
* Start the server:
npm start

## Usage
* User Authentication:
Register as a new user.
Log in with your credentials.
Manage your profile, bookings, and listings from the user dashboard.
* Listings Management:
Create new listings with multiple images.
Edit or delete your listings.
View listings on an interactive map.
* Booking System:
Book a listing by selecting the dates using the Flatpickr calendar.
View your bookings in the user dashboard.
* Reviews:
Leave reviews on listings you have booked.
View reviews for each listing.
* Admin Dashboard:
As a superadmin, manage all users and listings.
Perform CRUD operations on any listing or user.
* Search and Filter:
Use the search bar to find listings in real time. The search functionality includes a debouncer to optimize performance.
Filter listings by category, price range, and location.
* Pagination:
Navigate through listings and reviews using pagination controls to improve performance and user experience.

## Acknowledgements
* Mapbox
* Cloudinary
* Bootstrap
* Flatpickr
* Font Awesome
