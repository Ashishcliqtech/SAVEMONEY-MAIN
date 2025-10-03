# Backend Fix: Resolving the Gemini API `_id` Field Error

## 1. The Problem

The Google Gemini API is rejecting requests from our backend with a `400 Bad Request` error. The error message is:

```
Invalid JSON payload received. Unknown name "_id" at 'contents[0]': Cannot find field.
```

This happens because our database (e.g., MongoDB) adds an `_id` field to every chat message record. Our backend code is currently sending the entire chat history, including these `_id` fields, directly to the Gemini API. The Gemini API's validation is strict and only allows the `role` and `parts` fields.

## 2. The Solution

The solution is to "sanitize" the chat history on the backend *before* sending it to the Gemini API. We need to create a new, clean array of message objects that contains only the required `role` and `parts` fields.

## 3. Implementation Steps

This change needs to be applied in your backend service file that is responsible for calling the Gemini API. Based on standard project structures, this is likely located in `src/services/ai.service.js`.

### Step 1: Locate the `sendMessage` function in `src/services/ai.service.js`.

### Step 2: Modify the function to sanitize the history.

**Your code likely looks like this right now:**

```javascript
// src/services/ai.service.js (BEFORE THE FIX)

// ... other code ...

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

exports.sendMessage = async (userId, message) => {
    // ... code to get userHistory from the database ...

    const chat = model.startChat({
        history: userHistory.history, // This history contains `_id` fields!
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    
    // ... code to save the response to the database ...
    
    return response;
};
```

**You must modify it to add the sanitization step:**

```javascript
// src/services/ai.service.js (AFTER THE FIX)

// ... other code ...

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

exports.sendMessage = async (userId, message) => {
    // ... code to get userHistory from the database ...

    // --- START: SANITIZATION ---
    // Create a new array containing only the 'role' and 'parts' fields.
    const cleanHistory = userHistory.history.map(item => ({
        role: item.role,
        parts: item.parts.map(part => ({
            text: part.text
        }))
    }));
    // --- END: SANITIZATION ---

    const chat = model.startChat({
        history: cleanHistory, // Use the sanitized history
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    
    // ... code to save the response to the database ...

    return response;
};
```

By applying this change in your backend codebase, the error will be resolved.
