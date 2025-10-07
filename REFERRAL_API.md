
# Refer & Earn API Documentation

## 1. Overview

This document outlines the API endpoints and data models required to implement the "Refer & Earn" feature. The system allows users to refer friends using a unique code. When the referred friend signs up and completes a qualifying action (e.g., first purchase), both the referrer and the new user receive a bonus.

This system needs to:
- Generate a unique referral code for each user.
- Track referrals from creation to completion.
- Calculate and attribute earnings to the referrer.
- Provide a dashboard for users to view their referral status.

---

## 2. Data Models

### Referral

This model stores the relationship between a referrer and a referred user.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the referral record. |
| `referrerId` | `string` | The ID of the user who made the referral. |
| `referredId` | `string` | The ID of the new user who was referred. |
| `status` | `enum` | The current status of the referral. Can be `PENDING`, `COMPLETED`, or `EXPIRED`. |
| `createdAt` | `timestamp` | Timestamp when the referral was created. |
| `completedAt` | `timestamp` | Timestamp when the referral status changed to `COMPLETED`. |

### User

The existing `User` model should be updated to include a unique referral code.

| Field | Type | Description |
| :--- | :--- | :--- |
| `referralCode` | `string` | A unique, short, and user-friendly code (e.g., `JOHN-D4E8`). Should be generated upon user creation. |

---

## 3. Backend Flow

The referral process follows these steps:

1.  **Sign Up:** A new user signs up. Optionally, they can provide a `referralCode`.
2.  **Record Creation:** If a valid `referralCode` is provided, a new `Referral` record is created with a `PENDING` status. The `referrerId` is the user who owns the code, and `referredId` is the new user.
3.  **Qualifying Action:** The new user completes a "qualifying action" (e.g., their first purchase above a certain amount).
4.  **Status Update:** An internal service or webhook notifies the backend that the action is complete. The backend locates the corresponding `Referral` record and updates its status to `COMPLETED`.
5.  **Reward Distribution:** Upon successful status update, the system credits the referral bonus to both the referrer and the referred user's wallets or earnings balance.

---

## 4. API Endpoints

### 4.1. Apply Referral Code at Signup

This is not a separate endpoint but an extension of the existing user registration process.

**Endpoint:** `POST /api/v1/auth/signup`

#### Request Body

The request body for user signup should be modified to accept an optional `referralCode`.

```json
{
  "email": "new.user@example.com",
  "password": "strongpassword123",
  "name": "Jane Doe",
  "referralCode": "JOHN-D4E8"
}
```

#### Backend Logic

-   When this endpoint is called, validate the `referralCode`.
-   If the code is valid, find the `referrerId` (the user who owns the code).
-   After creating the new user (`referredId`), create a `Referral` record in the database with `referrerId`, `referredId`, and `status: 'PENDING'`.
-   If the code is invalid, reject the signup with a `400 Bad Request` error and a clear message.

### 4.2. Get Referral Dashboard Data

Retrieves the authenticated user's referral statistics and unique code.

**Endpoint:** `GET /api/v1/referral/dashboard`

**Authentication:** Required (JWT Bearer Token).

#### Success Response (200 OK)

Returns an object containing the user's referral dashboard data.

```json
{
  "referralCode": "JANE-A1B2",
  "referralLink": "https://www.savemoney.com/signup?ref=JANE-A1B2",
  "earnings": 750.00,
  "referredUsersCount": 15
}
```

#### Error Responses

-   `401 Unauthorized`: If the user is not authenticated.
-   `404 Not Found`: If the user data cannot be found.

### 4.3. [Internal] Update Referral on Purchase

This is an internal endpoint or webhook triggered by your e-commerce or order management system after a new user completes their first qualifying purchase.

**Endpoint:** `POST /api/v1/webhooks/first-purchase-completed`

**Authentication:** Secure API Key or internal service authentication.

#### Request Body

```json
{
  "userId": "uuid-of-the-new-user",
  "orderId": "uuid-of-the-order",
  "orderAmount": 1200.50
}
```

#### Backend Logic

1.  Verify the `userId` from the request body.
2.  Check if this `userId` corresponds to a `referredId` in a `Referral` record with `PENDING` status.
3.  If a pending referral exists, update its status to `COMPLETED`.
4.  Credit the referral bonus to both the referrer and the referred user.
5.  Log a transaction for both users for accounting purposes.

#### Success Response (200 OK)

```json
{
  "status": "processed",
  "message": "Referral completed successfully for user uuid-of-the-new-user."
}
```
