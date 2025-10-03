# AI Chatbot API v1.0 - Specification

This document outlines the API for a personalized AI chatbot powered by the Gemini API.

## 1. Authentication

All endpoints require a valid JWT passed in the `Authorization: Bearer <token>` header to identify the user.

## 2. Data Models

### AI Message Model
```json
{
  "role": "String", // 'user' or 'model'
  "parts": [ { "text": "String" } ]
}
```

---

## 3. API Endpoints

### 3.1. Get Chat History

-   **URL:** `/api/ai/chat/history`
-   **Method:** `GET`
-   **Authorization:** `isAuthenticated`
-   **Description:** Fetches the user's entire chat history with the AI. If no history exists, it creates a new empty history.
-   **Success Response (`200 OK`):**
    ```json
    {
      "history": [
        { "role": "user", "parts": [ { "text": "Hello!" } ] },
        { "role": "model", "parts": [ { "text": "Hi there! How can I help you today?" } ] }
      ]
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: If the auth token is missing or invalid.
    -   `500 Internal Server Error`: If there's a problem fetching from the database.
      ```json
      { "error": "Failed to retrieve chat history." }
      ```

### 3.2. Send Message

-   **URL:** `/api/ai/chat/send`
-   **Method:** `POST`
-   **Authorization:** `isAuthenticated`
-   **Description:** Sends a user's message to the backend, which then proxies it to the Gemini API. The user's message is added to the conversation history, and the AI's response is returned and also saved.
-   **Request Body:**
    ```json
    {
      "message": "string"
    }
    ```
-   **Success Response (`200 OK`):** The AI's response.
    ```json
    {
        "response": {
             "role": "model", 
             "parts": [ { "text": "I am doing great! Thanks for asking." } ]
        }
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: If the `message` field is missing or empty.
      ```json
      { "error": "Message is required." }
      ```
    -   `401 Unauthorized`: If the auth token is missing or invalid.
    -   `500 Internal Server Error`: If the server fails to communicate with the Gemini API or save the history.
      ```json
      { "error": "Failed to communicate with the AI." }
      ```
