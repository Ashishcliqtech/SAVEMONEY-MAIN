
# Home Page API Documentation

This document outlines the APIs required to power the dynamic components of the application's home page. 

## Table of Contents
1. [Hero Section Content API](#1-hero-section-content-api)
2. [Recommended Offers API](#2-recommended-offers-api)
3. [Platform Stats API](#3-platform-stats-api)
4. [Popular Stores API](#4-popular-stores-api)
5. [Categories API](#5-categories-api)
6. [Trending Offers API](#6-trending-offers-api)

---

## 1. Hero Section Content API

This API fetches dynamic content for the hero section, such as titles and subtitles. This allows for content updates without deploying new code.

- **Endpoint**: `/api/content`
- **Method**: `GET`
- **Description**: Retrieves content for a specific page and section.

### Query Parameters

| Parameter | Type   | Description                         | Example        |
|-----------|--------|-------------------------------------|----------------|
| `page`    | `string` | The page to fetch content for.      | `home`         |
| `section` | `string` | The section within the page.        | `hero`         |

### Example Request

```
GET /api/content?page=home&section=hero
```

### Example Response (`200 OK`)

```json
{
  "title": "Get Cashback on Every Purchase",
  "subtitle": "The best deals, coupons, and cashback offers from your favorite stores.",
  "searchPlaceholder": "Search for stores or offers..."
}
```

---

## 2. Recommended Offers API

Used by the **`RecommendedOffersCarousel`**, this endpoint fetches a list of featured or specially recommended offers.

- **Endpoint**: `/api/offers`
- **Method**: `GET`

### Query Parameters

| Parameter  | Type    | Description                                  | Example |
|------------|---------|----------------------------------------------|---------|
| `featured` | `boolean` | Set to `true` to fetch only featured offers. | `true`  |
| `limit`    | `number`  | The maximum number of offers to return.      | `8`     |

### Example Request

```
GET /api/offers?featured=true&limit=8
```

### Example Response (`200 OK`)

(See response format in [Trending Offers API](#6-trending-offers-api))

---

## 3. Platform Stats API

This API provides key statistics about the platform, displayed in the **Stats Section**.

- **Endpoint**: `/api/stats`
- **Method**: `GET`

### Example Request

```
GET /api/stats
```

### Example Response (`200 OK`)

```json
{
  "stats": [
    {
      "label": "Total Cashback Awarded",
      "value": "$1,2M+",
      "trend": "+15%"
    },
    {
      "label": "Active Users",
      "value": "500,000+",
      "trend": "+8%"
    },
    {
      "label": "Partner Stores",
      "value": "1,500+",
      "trend": "+20"
    }
  ]
}
```

---

## 4. Popular Stores API

Used by the **`StoreCarousel`**, this endpoint retrieves the most popular stores on the platform.

- **Endpoint**: `/api/stores`
- **Method**: `GET`

### Query Parameters

| Parameter   | Type     | Description                             | Example      |
|-------------|----------|-----------------------------------------|--------------|
| `sortBy`    | `string` | The field to sort the results by.       | `popularity` |
| `sortOrder` | `string` | The order of sorting (`asc` or `desc`). | `desc`       |
| `limit`     | `number` | The maximum number of stores to return. | `10`         |

### Example Request

```
GET /api/stores?sortBy=popularity&sortOrder=desc&limit=10
```

### Example Response (`200 OK`)

```json
{
  "stores": [
    {
      "id": "store-001",
      "name": "MegaMart",
      "logo": "https://cdn.example.com/logos/megamart.png",
      "cashbackRate": 8.5
    }
  ],
  "pagination": { ... }
}
```

---

## 5. Categories API

Used by the **`CategoryGrid`**, this endpoint fetches the main product or store categories.

- **Endpoint**: `/api/categories`
- **Method**: `GET`

### Query Parameters

| Parameter | Type   | Description                              | Example |
|-----------|--------|------------------------------------------|---------|
| `limit`   | `number` | The maximum number of categories to return. | `8`     |

### Example Request

```
GET /api/categories?limit=8
```

### Example Response (`200 OK`)

```json
{
  "categories": [
    {
      "id": "cat-001",
      "name": "Electronics",
      "icon": "smartphone"
    },
    {
      "id": "cat-002",
      "name": "Fashion",
      "icon": "shirt"
    }
  ],
  "pagination": { ... }
}
```

---

## 6. Trending Offers API

Used by the **`OfferGrid`**, this endpoint fetches offers that are currently trending.

- **Endpoint**: `/api/offers`
- **Method**: `GET`

### Query Parameters

| Parameter   | Type     | Description                             | Example   |
|-------------|----------|-----------------------------------------|-----------|
| `sortBy`    | `string` | The field to sort the results by.       | `trending`|
| `sortOrder` | `string` | The order of sorting (`asc` or `desc`). | `desc`    |
| `limit`     | `number` | The maximum number of offers to return. | `6`       |

### Example Request

```
GET /api/offers?sortBy=trending&sortOrder=desc&limit=6
```

### Example Response (`200 OK`)

```json
{
  "offers": [
    {
      "id": "offer-101",
      "title": "Exclusive 30% Off on All Electronics",
      "imageUrl": "https://cdn.example.com/images/offer-101.jpg",
      "cashbackRate": 15.0,
      "store": {
        "id": "store-001",
        "name": "MegaMart"
      }
    }
  ],
  "pagination": { ... }
}
```
