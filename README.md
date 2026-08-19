<div align="center">

# 💸 SplitSettle

### Group Expense Sharing & Settlement Platform

*Split it. Track it. Settle it — in the fewest transactions possible.*

<br/>

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Made With](https://img.shields.io/badge/made%20with-☕%20%2B%20⚛️-orange?style=flat-square)

[Live Demo](https://splitsettle-frontend.vercel.app) · [Report Bug](https://github.com/dilipMaurya1586/splitsettle/issues) · [Request Feature](https://github.com/dilipMaurya1586/splitsettle/issues)

</div>

<br/>

## 📌 The Problem

Trips, roommates, or shared bills always end in the same awkward moment:

> *"Wait... who owes who, and how much?"*

Manually tracking group expenses across 5-6 people leads to confusion, forgotten dues, and messy WhatsApp math. **SplitSettle** solves this with an automated, event-driven backend that calculates exactly who needs to pay whom — using the **minimum number of transactions possible.**

<br/>

## ✨ What It Does

| Feature | Description |
|---|---|
| 👥 **Group Management** | Create groups, add members, manage multiple circles (trips, roommates, projects) |
| 🧾 **Expense Tracking** | Log expenses, split by amount/percentage/equal share, filter by member or date |
| ✨ **AI-Powered Entry** | Describe an expense in plain English — AI extracts the amount, description, and participants for you |
| 🧮 **Debt Simplification Engine** | Custom algorithm reduces N-way group debt into the minimum possible number of settlements |
| 🔔 **Real-Time Notifications** | Async, event-driven alerts when expenses or settlements are updated |
| 🔐 **Secure Auth** | JWT-based authentication across every service |
| 📊 **Settlement Dashboard** | See pending balances, mark payments as settled, view full history |

<br/>

## 📸 Screenshots

<table>
<tr>
<td width="50%">

**Dashboard**
Net balance, group overview, and pending settlements at a glance.
<img width="1920" height="1080" alt="Screenshot (503)" src="https://github.com/user-attachments/assets/c73afe36-c2d4-4dfa-8447-fc7610979775" />


</td>
<td width="50%">

**Groups**
All your circles — trips, roommates, and events — in one place.
<img width="1920" height="1080" alt="Screenshot (504)" src="https://github.com/user-attachments/assets/33380688-c056-45dc-9a52-a29deb166f21" />


</td>
</tr>
<tr>
<td width="50%">

**Expenses**
Every expense in a group, who paid, and how it's split.
<img width="1920" height="1080" alt="Screenshot (506)" src="https://github.com/user-attachments/assets/6c9a221a-404f-4698-b713-da857c1dd211" />


</td>
<td width="50%">

**Settlements**
Simplified balances and the minimum set of payments needed to settle up.
<img width="1920" height="1080" alt="Screenshot (507)" src="https://github.com/user-attachments/assets/a49edf4e-d2ad-4371-9d5a-602858c4ba1a" />


</td>
</tr>
<tr>
<td width="50%">

**Add Expense — Manual**
Full control over description, amount, payer, and split.
<img width="1920" height="1080" alt="Screenshot (509)" src="https://github.com/user-attachments/assets/889f7c93-ca54-4487-add2-69d4bec2dd72" />

</td>
<td width="50%">

**Add Expense — Describe It (AI)**
Type it like you'd text a friend — AI fills in the rest.
<img width="1920" height="1080" alt="Screenshot (510)" src="https://github.com/user-attachments/assets/044bb54f-c7ad-4fab-886e-4e4c08c3657a" />



</td>
</tr>
<tr>
<td width="50%">

**Members**
See everyone in a group at a glance.
<img width="1920" height="1080" alt="Screenshot (508)" src="https://github.com/user-attachments/assets/62b39e36-c6b1-475d-9a76-6884a22cf62e" />


</td>
<td width="50%">

**Add Member**
Bring a friend into the group by email.
<img width="1920" height="1080" alt="Screenshot (511)" src="https://github.com/user-attachments/assets/fcab199f-ab74-4035-826f-f278fa3d74fe" />


</td>
</tr>
</table>

<br/>

## 🏗️ System Architecture

SplitSettle isn't a monolith with a database bolted on — it's built as **8 independently deployable microservices**, each with a single responsibility, discovered dynamically and routed through a central gateway.

```
                              ┌──────────────────────┐
                              │   React 19 Frontend   │
                              │   (Vercel)             │
                              └───────────┬───────────┘
                                          │  HTTPS
                              ┌───────────▼───────────┐
                              │     API Gateway        │
                              │  (Spring Cloud Gateway)│
                              └───────────┬───────────┘
                                          │
                    ┌───────────┬────────┼────────┬───────────┬──────────────┐
                    │           │        │         │           │              │
              ┌─────▼────┐┌────▼────┐┌───▼────┐┌───▼──────┐┌───▼─────┐┌───────▼───────┐
              │  User    ││  Group  ││Expense ││Settlement││   AI    ││ Notification  │
              │ Service  ││ Service ││Service ││ Service  ││ Service ││   Service     │
              └─────┬────┘└────┬────┘└───┬────┘└───┬──────┘└───┬─────┘└───────┬───────┘
                    │           │        │         │           │              │
                    └───────────┴────────┴─────────┴───────────┴──────────────┘
                                          │
                              ┌───────────▼───────────┐
                              │   Apache Kafka (Aiven) │
                              │  async event streaming │
                              └───────────┬───────────┘
                                          │
                              ┌───────────▼───────────┐
                              │   PostgreSQL (Neon)    │
                              └────────────────────────┘

              All services registered with Eureka Service Discovery
              Containerized with Docker · Orchestrated with Kubernetes
```

<br/>

## 🧠 The Core Algorithm

At the heart of SplitSettle is a **debt-simplification engine**. Instead of settling every pairwise debt individually (which can mean dozens of transactions in a large group), it collapses the entire group's balance sheet into the fewest possible transfers.

```
Before:  A owes B ₹500   |   B owes C ₹500   |   C owes A ₹200
After:   A owes C ₹300   |   B owes C ₹200          → 3 transactions → 2
```

<br/>

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Backend**
- Java 17 · Spring Boot · Spring Cloud
- Spring Cloud Gateway (routing)
- Eureka (service discovery)
- Spring Security + JWT (auth)
- Apache Kafka on Aiven (event streaming)
- PostgreSQL on Neon (persistence)
- Maven

</td>
<td valign="top" width="50%">

**Frontend & Infra**
- React 19 + Tailwind CSS
- Axios for API integration
- Docker + Docker Compose
- Kubernetes (orchestration)
- GitHub Actions (CI/CD)
- UptimeRobot (service monitoring)
- Vercel (frontend) · Render (backend)

</td>
</tr>
</table>

<br/>

## 🤖 AI Service

Parses natural language expense inputs into structured transaction data using **Spring AI** integrated with **Groq**.

**Example:**

Input: `"Sam paid ₹3750 for dinner for me, Sam and Amit"`

Output:
```json
{
  "description": "Dinner",
  "amount": 3750,
  "participantNames": ["Sam", "me", "Amit"],
  "splitType": "EQUAL"
}
```

The frontend then uses this structured response to pre-fill the "Add expense" form, so the user only has to review and save.

**Endpoint:** `POST /api/ai/parse-expense`

**Tech:** Spring Boot, Spring AI, Groq API (OpenAI-compatible chat completions), Eureka Client

<br/>

## 📂 Microservices

| Service | Responsibility |
|---|---|
| `api-gateway` | Single entry point, routes requests to downstream services |
| `eureka-server` | Service registry & discovery |
| `user-service` | Registration, login, JWT issuance, profile management |
| `group-service` | Group creation, membership management |
| `expense-service` | Expense CRUD, split logic |
| `settlement-service` | Debt-simplification engine, settlement tracking |
| `notification-service` | Kafka consumer for real-time alerts |
| `ai-service` | Natural-language expense parsing |

<br/>

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/dilipMaurya1586/splitsettle.git
cd splitsettle

# Spin up all services with Docker Compose
docker-compose up --build

# Frontend
cd splitsettle-frontend
npm install
npm start
```

Create a `.env` in the frontend root:

```env
REACT_APP_API_URL=http://localhost:8080
```

<br/>

## 📡 API Reference

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/groups
GET    /api/groups/my
POST   /api/groups/{groupId}/members
GET    /api/users/lookup?email={email}
POST   /api/expenses
GET    /api/expenses/group/{groupId}
GET    /api/settlements/group/{groupId}/balances
GET    /api/settlements/group/{groupId}/pending
POST   /api/settlements/group/{groupId}/calculate
POST   /api/settlements/{transactionId}/settle
POST   /api/ai/parse-expense
```

<br/>

## 🗺️ Roadmap

- [ ] Multi-currency support
- [ ] Recurring/subscription expenses
- [ ] Push notifications (mobile)
- [ ] Payment gateway integration for in-app settlement

<br/>

## ⏰ Pre-Demo Wake-Up Checklist

Render's free tier puts services to sleep after 15 minutes of inactivity.
Run this checklist **15 minutes before any demo** so every service is fully awake before you start.

### Step 1 — Wake all 8 backend services

Open each of these URLs in a new browser tab (all at once is fine):

- https://splitsettle-eureka.onrender.com
- https://splitsettle-user.onrender.com/actuator/health
- https://splitsettle-group.onrender.com/actuator/health
- https://splitsettle-expense.onrender.com/actuator/health
- https://splitsettle-settlement.onrender.com/actuator/health
- https://splitsettle-notification.onrender.com/actuator/health
- https://splitsettle-ai.onrender.com/actuator/health
- https://splitsettle-api.onrender.com/actuator/health

### Step 2 — Wait

Give it **90 seconds** minimum. Cold starts (DB connect + Eureka registration) can take 60–130 seconds per service.

### Step 3 — Confirm on UptimeRobot

Open [dashboard.uptimerobot.com/monitors](https://dashboard.uptimerobot.com/monitors) and confirm **all monitors show green (Up)** before you proceed.

Do not start the demo until every monitor is green — a single sleeping service (especially `eureka` or `user-service`, which everything else depends on) will cause 503 / "No servers available" errors across the app.

### Step 4 — Smoke test

Quickly run through the core flow once yourself before the actual demo:

1. Register a throwaway test account
2. Log in
3. Create a group
4. Add a member
5. Add an expense (manual + "Describe it" AI mode)
6. Check Settlements tab

If all 6 pass, you're good to go live.

<details>
<summary><strong>Why this is needed</strong></summary>
<br/>

- **Frontend:** Vercel (`splitsettle-frontend.vercel.app`) — always on, no action needed.
- **Backend:** Render free tier (`eureka`, `user`, `group`, `expense`, `settlement`, `notification`, `ai`, `api-gateway`) — sleeps after 15 min idle, takes ~60–130s to cold start.
- **Database:** Neon.tech Postgres — always on, no action needed.
- **Kafka:** Aiven Cloud — always on (unless manually paused in the Aiven console), no action needed.
- **UptimeRobot** pings all 8 Render services every 5 minutes to *try* to keep them awake, but this isn't 100% guaranteed — hence this manual checklist as a backup before anything important.

**Permanent fix (if budget allows later):** Upgrade the 8 Render services to the Starter plan (~$7/month each, ~$56/month total). Paid instances never sleep, and this entire checklist becomes unnecessary.

</details>

<br/>

## 👤 Author

**Dilip Maurya**
[GitHub](https://github.com/dilipMaurya1586) · [LinkedIn](https://linkedin.com/in/dilip-maurya-9061a0306) · [Portfolio](https://dilipmauryaportfolio.vercel.app)

<br/>

<div align="center">

*If SplitSettle saved you from doing group-trip math on a napkin, consider giving it a ⭐*

</div>

<!-- <div align="center">

# 💸 SplitSettle

### Group Expense Sharing & Settlement Platform

*Split it. Track it. Settle it — in the fewest transactions possible.*

<br/>

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Made With](https://img.shields.io/badge/made%20with-☕%20%2B%20⚛️-orange?style=flat-square)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

<br/>

## 📌 The Problem

Trips, roommates, or shared bills always end in the same awkward moment:

> *"Wait... who owes who, and how much?"*

Manually tracking group expenses across 5-6 people leads to confusion, forgotten dues, and messy WhatsApp math. **SplitSettle** solves this with an automated, event-driven backend that calculates exactly who needs to pay whom — using the **minimum number of transactions possible.**

<br/>

## ✨ What It Does

| Feature | Description |
|---|---|
| 👥 **Group Management** | Create groups, add members, manage multiple circles (trips, roommates, projects) |
| 🧾 **Expense Tracking** | Log expenses, split by amount/percentage/equal share, filter by member or date |
| 🧮 **Debt Simplification Engine** | Custom algorithm reduces N-way group debt into the minimum possible number of settlements |
| 🔔 **Real-Time Notifications** | Async, event-driven alerts when expenses or settlements are updated |
| 🔐 **Secure Auth** | JWT-based authentication across every service |
| 📊 **Settlement Dashboard** | See pending balances, mark payments as settled, view full history |

<br/>

## 🏗️ System Architecture

SplitSettle isn't a monolith with a database bolted on — it's built as **8 independently deployable microservices**, each with a single responsibility, discovered dynamically and routed through a central gateway.

```
                              ┌──────────────────────┐
                              │   React 19 Frontend   │
                              │   (Vercel)             │
                              └───────────┬───────────┘
                                          │  HTTPS
                              ┌───────────▼───────────┐
                              │     API Gateway        │
                              │  (Spring Cloud Gateway)│
                              └───────────┬───────────┘
                                          │
                    ┌───────────┬────────┼────────┬───────────┬──────────────┐
                    │           │        │         │           │              │
              ┌─────▼────┐┌────▼────┐┌───▼────┐┌───▼──────┐┌───▼─────┐┌───────▼───────┐
              │  User    ││  Group  ││Expense ││Settlement││   AI    ││ Notification  │
              │ Service  ││ Service ││Service ││ Service  ││ Service ││   Service     │
              └─────┬────┘└────┬────┘└───┬────┘└───┬──────┘└───┬─────┘└───────┬───────┘
                    │           │        │         │           │              │
                    └───────────┴────────┴─────────┴───────────┴──────────────┘
                                          │
                              ┌───────────▼───────────┐
                              │   Apache Kafka (Aiven) │
                              │  async event streaming │
                              └───────────┬───────────┘
                                          │
                              ┌───────────▼───────────┐
                              │   PostgreSQL (Neon)    │
                              └────────────────────────┘

              All services registered with Eureka Service Discovery
              Containerized with Docker · Orchestrated with Kubernetes
```

<br/>

## 🧠 The Core Algorithm

At the heart of SplitSettle is a **debt-simplification engine**. Instead of settling every pairwise debt individually (which can mean dozens of transactions in a large group), it collapses the entire group's balance sheet into the fewest possible transfers.

```
Before:  A owes B ₹500   |   B owes C ₹500   |   C owes A ₹200
After:   A owes C ₹300   |   B owes C ₹200          → 3 transactions → 2
```

<br/>

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Backend**
- Java 17 · Spring Boot · Spring Cloud
- Spring Cloud Gateway (routing)
- Eureka (service discovery)
- Spring Security + JWT (auth)
- Apache Kafka on Aiven (event streaming)
- PostgreSQL on Neon (persistence)
- Maven

</td>
<td valign="top" width="50%">

**Frontend & Infra**
- React 19 + Tailwind CSS
- Axios for API integration
- Docker + Docker Compose
- Kubernetes (orchestration)
- GitHub Actions (CI/CD)
- UptimeRobot (service monitoring)
- Vercel (frontend) · Render (backend)

</td>
</tr>
</table>

<br/>

## 🤖 AI Service

Parses natural language expense inputs into structured transaction data using **Spring AI** integrated with **Groq** (Mixtral-8x7B model).

**Example:**
Input: `"I paid 800 for dinner, split with Ravi and Sam"`

Output:
{
  "description": "Dinner",
  "amount": 800,
  "participantNames": ["Ravi", "Sam"],
  "splitType": "EQUAL"
}


**Endpoint:** `POST /api/ai/parse-expense`

**Tech:** Spring Boot, Spring AI, Groq API (OpenAI-compatible), Eureka Client


<br/>

## 📂 Microservices

| Service | Responsibility |
|---|---|
| `api-gateway` | Single entry point, routes requests to downstream services |
| `eureka-server` | Service registry & discovery |
| `user-service` | Registration, login, JWT issuance, profile management |
| `group-service` | Group creation, membership management |
| `expense-service` | Expense CRUD, split logic |
| `settlement-service` | Debt-simplification engine, settlement tracking |
| `notification-service` | Kafka consumer for real-time alerts |
| `ai-service` | Natural-language expense parsing |

<br/>

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/dilipMaurya1586/splitsettle.git
cd splitsettle

# Spin up all services with Docker Compose
docker-compose up --build

# Frontend
cd splitsettle-frontend
npm install
npm start
```

Create a `.env` in the frontend root:

```env
REACT_APP_API_URL=http://localhost:8080
```

<br/>

## 📡 API Reference

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/groups
GET    /api/groups/my
POST   /api/expenses
GET    /api/expenses/group/{groupId}
GET    /api/settlements/group/{groupId}/balances
POST   /api/settlements/group/{groupId}/calculate
POST   /api/settlements/{transactionId}/settle
POST   /api/ai/parse-expense
```

<br/>

## 🗺️ Roadmap

- [ ] Multi-currency support
- [ ] Recurring/subscription expenses
- [ ] Push notifications (mobile)
- [ ] Payment gateway integration for in-app settlement

<br/>

# SplitSettle — Pre-Demo Wake-Up Checklist

Render's free tier puts services to sleep after 15 minutes of inactivity.
Run this checklist **15 minutes before any demo **
so every service is fully awake before you start.

## Step 1 — Wake all 8 backend services

Open each of these URLs in a new browser tab (all at once is fine):

- https://splitsettle-eureka.onrender.com
- https://splitsettle-user.onrender.com/actuator/health
- https://splitsettle-group.onrender.com/actuator/health
- https://splitsettle-expense.onrender.com/actuator/health
- https://splitsettle-settlement.onrender.com/actuator/health
- https://splitsettle-notification.onrender.com/actuator/health
- https://splitsettle-ai.onrender.com/actuator/health
- https://splitsettle-api.onrender.com/actuator/health

## Step 2 — Wait

Give it **90 seconds** minimum. Cold starts (DB connect + Eureka registration)
can take 60–130 seconds per service.

## Step 3 — Confirm on UptimeRobot

Open [dashboard.uptimerobot.com/monitors](https://dashboard.uptimerobot.com/monitors)
and confirm **all monitors show green (Up)** before you proceed.

Do not start the demo until every monitor is green — a single sleeping
service (especially `eureka` or `user-service`, which everything else
depends on) will cause 503 / "No servers available" errors across the app.

## Step 4 — Smoke test

Quickly run through the core flow once yourself before the actual demo:

1. Register a throwaway test account
2. Log in
3. Create a group
4. Add a member
5. Add an expense (manual + "Describe it" AI mode)
6. Check Settlements tab

If all 6 pass, you're good to go live.

---

## Why this is needed (for your own reference)

- **Frontend:** Vercel (`splitsettle-frontend.vercel.app`) — always on, no action needed.
- **Backend:** Render free tier (`eureka`, `user`, `group`, `expense`,
  `settlement`, `notification`, `ai`, `api-gateway`) — sleeps after 15 min
  idle, takes ~60–130s to cold start.
- **Database:** Neon.tech Postgres — always on, no action needed.
- **Kafka:** Aiven Cloud — always on (unless manually paused in the Aiven
  console), no action needed.
- **UptimeRobot** pings all 8 Render services every 5 minutes to *try* to
  keep them awake, but this isn't 100% guaranteed — hence this manual
  checklist as a backup before anything important.

**Permanent fix (if budget allows later):** Upgrade the 8 Render services
to the Starter plan (~$7/month each, ~$56/month total). Paid instances
never sleep, and this entire checklist becomes unnecessary.

<br />

## 👤 Author

**Dilip Maurya**
[GitHub](https://github.com/dilipMaurya1586) · [LinkedIn](https://linkedin.com/in/dilip-maurya-9061a0306) · [Portfolio](https://dilipmauryaportfolio.vercel.app)

<br/>

<div align="center">

*If SplitSettle saved you from doing group-trip math on a napkin, consider giving it a ⭐*

</div> -->
