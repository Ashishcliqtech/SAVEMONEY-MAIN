# AI Chatbot API v1.0 - Specification

This document outlines the API for a personalized AI chatbot powered by the Gemini API.

## 1. Authentication

All endpoints require a valid JWT passed in the `Authorization: Bearer <token>` header to identify the user.

## 2. Data Models

### AI Message Model
```json
{
  "role": "String", 
  "parts": [ { "text": "String" } ]
}
```
**Note:** When sending chat history to the backend or from the backend to the generative AI service, ensure that the message objects strictly adhere to this model. Extra fields, such as `_id` from a database, can cause validation errors and must be removed.

---

## 3. API Endpoints

### 3.1. Get Chat History

Retrieves the user's entire chat history.

- **URL:** `/api/ai/chat/history`
- **Method:** `GET`
- **Success Response (200 OK):**

```json
{
  "history": [
    {
      "role": "user",
      "parts": [ { "text": "Hello" } ]
    },
    {
      "role": "model",
      "parts": [ { "text": "Hi there! How can I help you today?" } ]
    }
  ]
}
```

### 3.2. Send Message

Sends a new message to the chatbot and gets a response. The backend service is responsible for retrieving the conversation history, appending the new user message, and sending it to the AI.

- **URL:** `/api/ai/chat/send`
- **Method:** `POST`
- **Body:**

```json
{
  "message": "What is the capital of France?"
}
```

- **Success Response (200 OK):**

```json
{
  "response": {
    "role": "model",
    "parts": [
      {
        "text": "The capital of France is Paris."
      }
    ]
  }
}
```

---

## 4. Error Responses

### 4.1. Bad Request (400)

Returned when the request payload is malformed or invalid.

```json
{
  "error": "Invalid request body"
}
```

### 4.2. Unauthorized (401)

Returned when the JWT is missing or invalid.

```json
{
  "error": "Unauthorized"
}
```

### 4.3. Internal Server Error (500)

Returned for unexpected server-side errors, such as a failure to communicate with the AI service. The error from the generative AI service that prompted this fix would result in a 500 error to the client.

```json
{
  "error": "Failed to get a response from the AI."
}
```
