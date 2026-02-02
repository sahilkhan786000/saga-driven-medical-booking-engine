# Saga-Driven Medical Booking Engine

An **event-driven medical clinic booking system** built to demonstrate **distributed transaction handling** using the **Saga choreography pattern**, with proper **compensation logic**, **observability**, and **failure recovery**.

This project was implemented as part of a backend engineering take-home assignment to showcase system design, event-driven workflows, and transactional consistency without relying on traditional database transactions.

---

## 📌 Problem Overview

The system processes medical service bookings for users while enforcing business rules such as:

- Gender- and birthday-based discounts
- High-value order discounts
- A **system-wide daily discount quota**
- Safe rollback and compensation in case of failures

The system is intentionally designed **without REST APIs** to focus on **event-driven backend architecture** rather than CRUD endpoints.

---

## 🏗 Architecture Overview

- **Architecture Style:** Event-Driven
- **Pattern Used:** Saga (Choreography-based)
- **Client:** Terminal (CLI)
- **Communication:** Events (in-memory event bus simulating Pub/Sub)
- **State Persistence:** File-based JSON store (for discount quota)
- **Observability:** Structured + human-readable logs

Each service reacts to events independently and emits the next event in the workflow, ensuring **loose coupling**.

---

## 🔄 High-Level Workflow

BOOKING_REQUESTED
↓
PRICE_CALCULATED
↓
DISCOUNT_CHECKED
↓
PAYMENT_STARTED
↓
BOOKING_CONFIRMED / BOOKING_CANCELLED


No service directly calls another service.  
All coordination happens through events.

---

## 💼 Business Rules Implemented

### R1 – Discount Rule
A **12% discount** is applied if:
- The user is **female AND today is her birthday**, OR
- The **base price exceeds ₹1000**

### R2 – Daily Discount Quota (System-Wide)
- A fixed number of discounts allowed per day (configurable)
- Applies **only** to R1-eligible bookings
- If the quota is exhausted → **booking is rejected**
- Quota resets automatically when the date changes (IST)
- Quota is persisted across application restarts

---

## 🔁 Saga & Compensation Logic

This system uses **Saga Choreography**, meaning:

- No central orchestrator
- Each service listens for and reacts to events
- Failures trigger **compensating actions**

### Compensation Examples
- If payment fails after discount is applied → **discount quota is restored**
- If discount quota is exhausted → **booking is cancelled immediately**
- The system never ends in a partial or inconsistent state

---

## 🧾 Assumptions Made

1. Payment processing is **simulated**, not integrated with a real gateway
2. Discount quota is **system-wide**, not per user (as specified)
3. In-memory Event Bus simulates cloud Pub/Sub (Kafka / GCP Pub/Sub)
4. File-based persistence simulates Redis / database storage
5. Timezone assumed as IST
6. CLI processes one booking request at a time (for demo simplicity)

---

## 🧪 Test Scenarios (End-to-End)

### ✅ Test Case 1 – Positive Case (Successful Booking)

**Input**
Name: Asha
Gender: Female
DOB: Today
Services: Blood Test, ECG


**Flow**
BOOKING_REQUESTED
→ PRICE_CALCULATED
→ DISCOUNT_CHECKED
→ PAYMENT_STARTED
→ BOOKING_CONFIRMED


**Result**
✅ Booking Confirmed
Final Price: ₹968
Reference ID generated


**Validates**
- Pricing logic
- Discount rule
- Successful Saga completion

---

### ❌ Test Case 2 – Negative Case (Discount Quota Exhausted)

**Setup**
Daily Discount Limit = 1
Already Used = 1


**Input**
Name: Riya
Gender: Female
DOB: Today
Services: ECG


**Flow**
BOOKING_REQUESTED
→ PRICE_CALCULATED
→ DISCOUNT_CHECK_STARTED
→ BOOKING_CANCELLED


**Result**
❌ Booking Failed
Reason: Daily discount quota reached


**Compensation**
- Discount not applied
- Payment not initiated
- Booking safely cancelled

---

### ❌ Test Case 3 – Negative Case (Payment Failure + Compensation)

**Input**
Name: fail
Gender: Female
DOB: Today
Services: X-Ray


**Flow**
BOOKING_REQUESTED
→ PRICE_CALCULATED
→ DISCOUNT_CHECKED
→ PAYMENT_STARTED
→ PAYMENT_FAILED
→ DISCOUNT_ROLLBACK
→ BOOKING_CANCELLED


**Result**
❌ Booking Failed
Reason: Payment failed
Discount quota restored


**Compensation**
- Discount quota rolled back
- System consistency preserved

---

## 🧠 Why Saga Instead of SQL Transactions?

In real-world microservice systems:
- Each service owns its own database
- SQL transactions cannot span multiple services
- Network failures must be handled explicitly

Saga replaces cross-service transactions with:
- Event-driven workflows
- Compensating actions
- Eventual consistency

---

## 🚀 How to Run

```bash
npm install
npm start
```

---

## 📊 Observability & Logs

The system emits:
- Step-by-step processing logs
- Clear success and failure messages
- Compensation and rollback indicators

Logs are formatted to be:
- Human-readable (for demos)
- Structured internally (for tracing)

---

## 🏁 Final Notes

This project intentionally focuses on:
- Distributed transaction management
- Event-driven architecture
- Failure handling and compensation

It does not focus on:
- REST API design
- UI development
- External payment gateways
