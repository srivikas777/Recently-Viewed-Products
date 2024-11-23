**Project Submission: User Profile Enhancement with Recently Viewed Products**

Dear Hiring Team,

I am submitting my take-home assignment for the "Enhance User Profile with Recently Viewed Products" project. This application is a containerized Node.js app that integrates Firebase and Redis to allow users to easily revisit products they've shown interest in.

**Project Overview:**

- **Backend:**
  - **Platform:** Built on Firebase, with a new project created specifically for this assignment.
  - **Containerization:** Utilized Docker to containerize the application for consistent deployment.
  - **Framework:** Developed using Express.js for robust routing and middleware management.
  - **Cache:** Implemented Redis for caching frequently accessed data, enhancing performance.
  - **Authentication:** Integrated Firebase Authentication; mocked during testing to facilitate test automation.
  - **Versioned Router:** Implemented versioned routing (e.g., `/api/v1/`) to support future API iterations.

- **Data Storage:**
  - **Firestore Subcollection:** Created `users/{userId}/recentlyViewed` subcollections.
  - **Stored Data:** Product IDs and timestamps for efficient querying and limiting results.

- **Middleware:**
  - **Logging:** Middleware logs product views and updates the `recentlyViewed` subcollection.
  - **Limiting:** Ensures only the 10 most recent products are stored per user.
  - **Caching:** Used Redis to cache top viewed products, reducing database load.

- **API Endpoint:**
  - **Endpoint:** `GET /api/v1/users/{userId}/recentlyViewed`
  - **Authentication:** Requires Firebase user authentication.
  - **Response:** Returns an array of product IDs and timestamps in JSON format.

- **Email Notification:**
  - **Cloud Function Trigger:** Monitors the `recentlyViewed` collection.
  - **Notifications:** Sends email alerts using Nodemailer when a product is viewed more than twice within a specific timeframe.

**Frontend:**

- **Display:** Added a section in the user's profile to show recently viewed products.
- **UI:** Implemented as a simple list for clarity and ease of use.
- **Links:** Each product links to a detailed product page (mocked data).

**API Documentation:**

- **Swagger:** Documented the API endpoint with Swagger, including authentication requirements, request/response formats, and error handling.
- **Access:** Documentation is available at `/api-docs` when the app is running.

**Additional Considerations:**

- **Error Handling:**
  - Implemented comprehensive error handling and logging throughout the application.
  - Returns informative error messages to the client while avoiding exposure of sensitive information.

- **Testing:**
  - Wrote unit and integration tests using Jest and Supertest.
  - Ensured code quality and functionality meet industry standards.

**Setup Instructions:**

1. **Clone the Repository:**
   - The code is available on GitHub. Access has been granted as per the instructions.

2. **Environment Configuration:**
   - Set up Firebase with your own project credentials.
   
3. **Running the Application:**
   - Use Docker Compose to build and run the application:
     ```bash
     docker-compose build
     docker-compose up
     ```
   - The application will be accessible at `http://localhost:3001`.

**Conclusion:**

This project demonstrates the integration of several technologies to enhance user experience by providing a "Recently Viewed Products" feature.

Thank you for the opportunity to work on this assignment. I look forward to discussing any questions you may have.

Best regards,
Sri Vikas P