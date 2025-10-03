
# Backend Gemini API Implementation Guide

This document provides a comprehensive guide for backend developers to implement the server-side logic for the AI chatbot, which is powered by the Google Gemini API.

## 1. Overview

The backend has two primary responsibilities:

1.  **Manage Chat History:** Store and retrieve the conversation history for each user.
2.  **Proxy to Gemini:** Receive messages from the user, forward them to the Gemini API, and then save and send the AI's response back to the client.

## 2. Setup and Prerequisites

### **Step 1: Get a Gemini API Key**

1.  Go to the [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Create a new project or use an existing one.
4.  Click on **"Get API key"** and create a new API key.

### **Step 2: Store the API Key Securely**

**Do not hardcode the API key in your application.** Use a secure method to store and access it.

-   Create a `.env` file in the root of your backend project.
-   Add the following line to your `.env` file:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```
-   Make sure your `.gitignore` file includes `.env` to prevent the key from being committed to version control.
-   Use a library like `dotenv` (for Node.js) to load this environment variable into your application.

## 3. Backend Implementation (Node.js/Express Example)

This example uses Node.js, Express, and the `@google/generative-ai` package.

### **Step 1: Install Dependencies**

```bash
npm install express cors @google/generative-ai dotenv
```

### **Step 2: Set Up the Express Server**

Create a file (e.g., `server.js`) and set up your server. You will also need to configure your database (e.g., MongoDB with Mongoose) to store chat histories.

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose'); // Example using Mongoose

// --- Authentication Middleware (Placeholder) ---
const isAuthenticated = (req, res, next) => {
    // Implement your real JWT authentication logic here.
    // For this example, we'll mock a user.
    req.user = { id: 'mock_user_id' }; 
    next();
};

// --- Mongoose Schema and Model ---
const chatHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    history: [{ role: String, parts: [{ text: String }] }],
});
const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

// --- Gemini AI Initialization ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Express App Setup ---
const app = express();
app.use(cors());
app.use(express.json());

// TODO: Connect to your MongoDB instance
// mongoose.connect('your_mongodb_connection_string');

// --- API Endpoints ---

// Endpoint 1: Get or Create Chat History
app.get("/api/ai/chat/history", isAuthenticated, async (req, res) => {
    try {
        let userHistory = await ChatHistory.findOne({ userId: req.user.id });
        if (!userHistory) {
            userHistory = new ChatHistory({ userId: req.user.id, history: [] });
            await userHistory.save();
        }
        res.json({ history: userHistory.history });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve chat history." });
    }
});

// Endpoint 2: Send Message to AI
app.post("/api/ai/chat/send", isAuthenticated, async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        const userHistory = await ChatHistory.findOne({ userId: req.user.id });

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        const chat = model.startChat({
            history: userHistory.history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const aiResponse = response.text();

        // Save the new user message and AI response to the database
        userHistory.history.push({ role: 'user', parts: [{ text: message }] });
        userHistory.history.push({ role: 'model', parts: [{ text: aiResponse }] });
        await userHistory.save();

        res.json({ response: { role: 'model', parts: [{ text: aiResponse }] } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to communicate with the AI." });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

### **Step 3: Personalize the Chatbot**

In the `startChat` method, you can add a `systemInstruction` to give the chatbot a personality and context that matches your application.

```javascript
// Inside the /api/ai/chat/send endpoint

const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    systemInstruction: "You are a friendly and helpful assistant for our application, [Your App Name]. Your goal is to help users with their questions about our features and provide support.",
});

// ... rest of the code
```

## 4. Final Steps

-   **Connect to Database:** Replace the placeholder Mongoose connection string with your actual database URL.
-   **Implement Real Authentication:** Replace the mock `isAuthenticated` middleware with your actual JWT token validation logic.
-   **Deploy:** Deploy your backend server to a service like Heroku, Vercel, or AWS.
