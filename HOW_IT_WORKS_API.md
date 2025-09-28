
# How It Works Page API Documentation

This document outlines the API for the "How It Works" page. The page's content is fetched from a single endpoint, making it easy to manage and update.

- **Endpoint**: `/api/content/how-it-works`
- **Method**: `GET`
- **Description**: Retrieves all the content required for the "How It Works" page.

### Example Request

```
GET /api/content/how-it-works
```

### Example Response (`200 OK`)

A successful request returns a JSON object with the following structure:

```json
{
  "hero": {
    "title": "How SaveMoney Works",
    "subtitle": "Start earning cashback in 3 simple steps. Join over 2 million users who are already saving money on every purchase.",
    "primaryAction": "Get Started Free",
    "secondaryAction": "Watch Demo"
  },
  "steps": {
    "title": "3 Simple Steps to Start Earning",
    "subtitle": "Our platform makes it incredibly easy to earn cashback on every purchase",
    "items": [
      {
        "step": 1,
        "title": "Sign Up & Browse",
        "description": "Create your free account and browse thousands of of offers from top brands and stores.",
        "icon": "Users",
        "color": "text-purple-600",
        "bgColor": "bg-purple-100",
        "details": [
          "Quick 2-minute registration",
          "Email or social login options",
          "Browse 500+ partner stores",
          "No hidden fees or charges"
        ]
      },
      {
        "step": 2,
        "title": "Shop & Earn",
        "description": "Click through our links to shop at your favorite stores and automatically earn cashback.",
        "icon": "ShoppingBag",
        "color": "text-teal-600",
        "bgColor": "bg-teal-100",
        "details": [
          "Click on any store or offer",
          "Shop normally on merchant site",
          "Cashback tracked automatically",
          "Up to 25% cashback rates"
        ]
      },
      {
        "step": 3,
        "title": "Get Paid",
        "description": "Withdraw your earnings via UPI, bank transfer, or gift vouchers once you reach minimum threshold.",
        "icon": "CreditCard",
        "color": "text-green-600",
        "bgColor": "bg-green-100",
        "details": [
          "Multiple withdrawal options",
          "Minimum ₹10 for UPI",
          "Fast processing times",
          "Secure payment methods"
        ]
      }
    ]
  },
  "features": {
    "title": "Why Choose SaveMoney?",
    "subtitle": "We're committed to providing the best cashback experience with industry-leading features",
    "items": [
      {
        "title": "Instant Tracking",
        "description": "Your cashback is tracked instantly when you make a purchase",
        "icon": "Clock",
        "color": "text-blue-600",
        "bgColor": "bg-blue-100"
      },
      {
        "title": "Secure Payments",
        "description": "Bank-level security with encrypted transactions",
        "icon": "Shield",
        "color": "text-green-600",
        "bgColor": "bg-green-100"
      },
      {
        "title": "Mobile App",
        "description": "Shop on the go with our mobile app",
        "icon": "Smartphone",
        "color": "text-purple-600",
        "bgColor": "bg-purple-100"
      },
      {
        "title": "Referral Bonus",
        "description": "Earn extra by inviting friends to join",
        "icon": "Gift",
        "color": "text-orange-600",
        "bgColor": "bg-orange-100"
      }
    ]
  },
  "faqs": {
    "title": "Frequently Asked Questions",
    "subtitle": "Got questions? We've got answers to help you get started",
    "items": [
      {
        "question": "How long does it take to receive cashback?",
        "answer": "Cashback is typically credited within 24-48 hours for most stores. Some stores may take up to 7-14 days to confirm the transaction."
      },
      {
        "question": "Is there a minimum withdrawal amount?",
        "answer": "Yes, minimum withdrawal amounts vary by method: UPI - ₹10, Bank Transfer - ₹50, Paytm - ₹10, Gift Vouchers - ₹100."
      },
      {
        "question": "Can I use other coupon codes?",
        "answer": "Using external coupon codes may void your cashback eligibility. We recommend using only the codes provided on our platform."
      },
      {
        "question": "How does the referral program work?",
        "answer": "Share your unique referral link with friends. When they sign up and make their first purchase, you both earn bonus cashback."
      }
    ]
  },
  "cta": {
    "title": "Ready to Start Earning Cashback?",
    "subtitle": "Join millions of users who are already saving money on every purchase. Sign up today and get ₹100 welcome bonus!",
    "primaryAction": "Get Started Now",
    "secondaryAction": "Browse Offers"
  }
}
```
