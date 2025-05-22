# ShortLink
**ShortLink** is a user-friendly URL shortening web application that provides instant redirection. Guest users can quickly generate basic short links, while registered users gain additional features such as custom URL aliases, branded QR codes, and a searchable dashboard with visit statistics.<br><br>
![image](https://github.com/user-attachments/assets/493fb153-cf8f-412f-9501-0e907dac0343)<br>
## Technology Stack
* **Backend:** Node.js, Express.js (follows the MVC pattern)
* **Frontend:** React.js with Tailwind CSS for styling
* **Database:** MongoDB (Mongoose as Object Data Modelling)
* **Authentication:** JSON Web Tokens (JWT) for user sessions
* **Testing:** Jest and Supertest for automated API testing

## Application User Flow Diagram
**Figure 1:** <br>
<i>Guest User Flow Diagram</i><br>
![image](https://github.com/user-attachments/assets/7620587b-4ad8-4979-8175-9e9292351af4)<br>
**Figure 2:** <br>
<i>Registered User Flow Diagram</i><br>
![image](https://github.com/user-attachments/assets/f8723934-a1f3-4414-a0f7-026bbfa99928)

## Features
* Shorten long URLs into compact links (guest and registered users)
* Instant redirection to original URLs (guest and registered users)
* Custom alias creation (registered users)
* Branded QR code generation (registered users)
* Dashboard with link management and visit statistics (registered users)
* Search functionality to filter links in the dashboard

## Setup and Installation

Follow these steps to set up and run the ShortLink project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Kingsley-commit/ShortLink.git
   cd ShortLink
   ```
2. **Install dependencies:**

   * **Backend (server):**

     ```bash
     cd backend
     npm install
     ```
   * **Frontend (client):**

     ```bash
     cd frontend
     npm install
     ```
3. **Configure environment (if applicable):**

   * Create a `.env` file in the `backend` directory with any required variables. For example:

     ```txt
     JWT_SECRET=your_jwt_secret
     PORT=5000
     MONGO_URI = your_MongoDB_URI
     ```
   * By default, the server runs on port 5000 and the React app on port 3000. Adjust these as needed.
4. **Run the application:**

   * **Start the server:** In the `backend` folder, run:

     ```bash
     npm start
     ```

     This starts the Express backend (Nodemon is typically used for auto-reloading in development).
   * **Start the client:** In a separate terminal, navigate to the `frontend` folder and run:

     ```bash
     npm run dev
     ```

     This launches the React app (usually on `http://localhost:3000`).
5. **Run tests:**

   * In the `backend` folder, execute:

     ```bash
     npm test
     ```

   This runs the Jest/Supertest test suite. Test coverage focuses on key endpoints (`/api/encode` and `/api/decode`).

## Project Architecture

The backend follows a **Model-View-Controller (MVC)** structure with a RESTful API design. The codebase is organized as follows:

* **Controllers:** Handle incoming requests and responses for each endpoint.
* **Routes:** Define API routes and link them to controller functions.
* **Services:** Contain business logic (e.g., URL encoding/decoding, alias generation).
* **Models:** Represent data structures and manage the storage.
* **app.ts (or server.ts):** Sets up the Express application, middleware, and routes.

This organization keeps the code modular and maintainable. Each API endpoint (under `/api`) corresponds to a controller function and uses proper HTTP verbs, following RESTful principles.

## Testing

Automated tests are written using **Jest** and **Supertest** for the API. To run the tests, use:

```bash
npm test
```

in the `backend` directory. Key tests include:

* **`/api/encode`:** Tests covering URL shortening functionality, including validation (e.g., missing URL) and duplicate alias errors.
* **`/api/decode`:** Tests verifying that short URLs are correctly decoded to original URLs and that proper errors are returned for invalid inputs (e.g., non-existent short URLs).

Ensure all tests pass before deploying or pushing changes.

## Deployment

ShortLink is deployed and accessible at [https://shortlnk.live](https://shortlnk.live). You can try the live demo to shorten URLs and explore all features. The source code for this project is available on GitHub: [https://github.com/Kingsley-commit/ShortLink](https://github.com/Kingsley-commit/ShortLink).

---

# API Documentation

This document describes the available API endpoints for the **ShortLink** service.

## Base URL

* **Production:** `https://shortlnk.live`
* **Local (Development):** `http://localhost:5000` (assuming the server runs on port 5000)

All `/api` endpoints expect and return JSON. Include a JWT in the `Authorization` header (`Bearer <token>`) for endpoints that require authentication.

## Endpoints

### POST `/api/encode`

* **Description:** Shorten a long URL.

  * **Guest users:** Receive a randomly generated short link.
  * **Registered users:** Can provide a custom `alias` and optionally generate a QR code.
* **Authentication:** Optional. Include `Authorization: Bearer <token>` to use the custom alias feature.
* **Request Headers:**

  * `Content-Type: application/json`
  * `Authorization: Bearer <token>` (optional, required only for custom alias)
* **Request Body:** JSON object:

  ```json
  {
    "url": "https://example.com/very/long/url",
    "customCode": "customAlias"    // Optional (for authenticated users)
  }
  ```

  * `url` (string, required): The original URL to shorten.
  * `customCode` (string, optional): Desired custom short code (useable by authenticated users only).
* **Success Response (200 OK):** JSON with the shortened link details. Example:

  ```json
  {
    "shortUrl": "https://shortlnk.live/customAlias",
    "originalUrl": "https://example.com/very/long/url",
    "customCode": "customAlias"
  }
  ```
* **Error Responses:**

  * **400 Bad Request:** Missing or invalid `url`.

    ```json
    { "error": "Original URL is required." }
    ```
  * **401 Unauthorized:** Attempted custom alias without a valid JWT.

    ```json
    { "error": "Authentication token is missing or invalid." }
    ```
  * **409 Conflict:** The requested `customCode` is already taken.

    ```json
    { "error": "customCode 'customCode' is already in use." }
    ```

### POST `/api/decode`

* **Description:** Decode a short URL back to the original URL.
* **Authentication:** Not required.
* **Request Headers:** `Content-Type: application/json`
* **Request Body:** JSON object:

  ```json
  { 
    "shortUrl": "https://shortlnk.live/abc123"
  }
  ```

  * `shortUrl` (string, required): The short URL to decode.
* **Success Response (200 OK):** JSON with the original URL. Example:

  ```json
  {
    "originalUrl": "https://example.com/very/long/url",
    "customCode": "abc123"
  }
  ```
* **Error Responses:**

  * **400 Bad Request:** Missing `shortUrl` in the request.

    ```json
    { "error": "Short URL is required." }
    ```
  * **404 Not Found:** The provided short URL does not exist.

    ```json
    { "error": "Short URL not found." }
    ```

### GET `/api/statistic/:url_path`

* **Description:** Retrieve visit statistics for a specific short URL.
* **Authentication:** Required (JWT). Only the link owner may access its statistics.
* **Request Parameters:**

  * `url_path` (string, required): The short code (path segment) of the URL.
* **Request Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):** JSON with details and visit stats. Example:

  ```json
  {
    "shortUrl": "https://shortlnk.live/abc123",
    "originalUrl": "https://example.com/very/long/url",
    "createdAt": "2025-01-01T12:00:00Z",
    "visitCount": 2,
    "visits": [
      {
        "timestamp": "2025-05-22T04:00:00Z",
        "ip": "192.168.1.10",
        "userAgent": "Mozilla/5.0"
      },
      {
        "timestamp": "2025-05-23T09:15:42Z",
        "ip": "192.168.1.12",
        "userAgent": "Chrome/58.0"
      }
    ]
  }
  ```
* **Error Responses:**

  * **400 Bad Request:** Missing or invalid `url_path`.

    ```json
    { "error": "URL path parameter is required." }
    ```
  * **401 Unauthorized:** No or invalid JWT token provided.

    ```json
    { "error": "Authentication required." }
    ```
  * **404 Not Found:** No link matches the given `url_path` (or not owned by user).

    ```json
    { "error": "Link not found." }
    ```

### GET `/api/list`

* **Description:** List all short URLs created by the authenticated user.
* **Authentication:** Required (JWT).
* **Request Headers:** `Authorization: Bearer <token>`
* **Success Response (200 OK):** An array of link objects. Example:

  ```json
  [
    {
      "shortUrl": "https://shortlnk.live/abc123",
      "originalUrl": "https://example.com/page",
      "createdAt": "2025-01-01T12:00:00Z",
      "visitCount": 10
    },
    {
      "shortUrl": "https://shortlnk.live/myLink",
      "originalUrl": "https://example.com/other",
      "createdAt": "2025-02-15T09:30:00Z",
      "visitCount": 5
    }
  ]
  ```
* **Error Responses:**

  * **401 Unauthorized:** No or invalid JWT token provided.

    ```json
    { "error": "Authentication required." }
    ```

### GET `/:url_path`

* **Description:** Redirect to the original URL corresponding to the short code.
* **Authentication:** Not required.
* **Request Parameters:**

  * `url_path` (string, required): The short code (path segment) to redirect.
* **Success Response (302 Found):** Redirects the client to the original URL. For example, if `/abc123` maps to `https://example.com/page`, the server responds:

  ```http
  HTTP/1.1 302 Found
  Location: https://example.com/page
  ```
* **Error Responses:**

  * **404 Not Found:** No link matches the given `url_path`.

    ```json
    { "error": "Link not found." }
    ```

## Notes
* **Link Expiration:** By default, short links do not expire. Once created, links remain valid indefinitely.
* **Rate Limiting:** The current implementation does not include rate limiting. In a production environment, you may want to add rate limiting to prevent abuse (e.g., too many requests from a single IP).
        *  
