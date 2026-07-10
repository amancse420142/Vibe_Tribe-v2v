# EquiPatent

## The Idea:
Despite developing breakthrough concepts in university labs, female STEM innovators face a devastating, two-part financial hurdle that causes their deep-tech intellectual property to die before commercialization. First, they are starved of early-stage capital—receiving less than 3% of venture capital funding—making it nearly impossible to transition raw software or lab ideas into working prototypes. Second, even if a prototype is successfully built, the exorbitant legal costs of filing a patent prevent these engineers from bringing their innovations to market. Currently, the tech ecosystem lacks a financial infrastructure that safely bridges early technical development with long-term IP protection.  

### Our Solution: EquiPatent
EquiPatent bridges this gap by offering a comprehensive innovation pipeline and crowdfunding marketplace tailored for female creators. Instead of blindly funding raw ideas, our platform utilizes a two-tier funding escrow system:  
#### Phase 1 (Prototype Funding): 
Backers provide micro-grants that are dynamically unlocked only when the platform validates real technical progress, such as verified Git pushes or peer-reviewed research documentation.  
#### Phase 2 (IP Fractionalization): 
Once the prototype is verified, the platform automatically generates fractional IP shares. Institutional backers and university alumni can purchase these shares to cover the prohibitive costs of patent filing and cloud hosting, receiving a micro-percentage of future software licensing royalties in return.  

EquiPatent successfully merges FinTech and STEM by allowing female creators to showcase verifiable technical assets on a deep-tech portfolio dashboard, ultimately transforming early-stage prototypes into highly valuable, protected intellectual property.

## Important Links

## Features

## Tech Stack & Tools

The website is built on a MERN Stack (MongoDB, Express, React, Node.js) paired with modern utility frameworks. Here is the complete breakdown of the technologies used:

### 1. Frontend (Client-side)
* **React (v19)**: Component-based UI engine.
* **Vite**: Next-generation lightning-fast build tool and development server.
* **Tailwind CSS (v4)**: Modern CSS configuration for the styling, dark-mode glassmorphic layouts, and responsive grids.
* **Framer Motion**: Used for fluid animations, sliding forms, page transitions, and interactive user flows.
* **Lucide React**: Icon library used for vector iconography across navigation dashboards and forms.

### 2. Backend (Server-side)
* **Node.js**: Asynchronous JavaScript runtime environment.
* **Express**: RESTful API framework routing dashboard commands, database requests, and profile validation states.
* **CORS**: Middleware configured to securely link frontend API calls to backend endpoints.

### 3. Database
* **MongoDB**: NoSQL database holding persistent user profiles, verified academic credentials, and project milestone data.
* **Mongoose**: Object Data Modeling (ODM) library connecting Express endpoints securely to MongoDB collections.

### 4. Hosting & Deployment
* **Vercel**: Hosts the static compiled React frontend.
* **Render**: Hosts the dynamic live Node.js/Express API server.

## Documentation

This guide will help you set up and run EquiPatent locally on your machine.

### 1. Prerequisites
Before getting started, make sure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.x or higher)
*   [MongoDB](https://www.mongodb.com/) (Local Community Server or Atlas Cluster connection)
*   [Git](https://git-scm.com/)

---

### 2. Folder Structure
The repository is split into two main sections:
*   `/backend`: Node.js, Express, and Mongoose schemas/controllers.
*   `/frontend`: React, Vite, Framer Motion, and Tailwind CSS.

---

### 3. Local Setup & Installation

#### Step A: Clone the Repository
```bash
git clone https://github.com/amancse420142/Vibe_Tribe-v2v.git
cd Vibe_Tribe-v2v
```

#### Step B: Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/backend` directory and add your connection variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/equipatent
   ```

#### Step C: Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

### 4. Running Locally

#### Run Backend Server:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Run Frontend Dev Server:
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

---

### 5. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Registers a new female STEM developer node. |
| `POST` | `/api/login` | Validates credentials and initializes local user session. |
| `GET` | `/api/profile` | Fetches active profile data, synced projects, and milestones. |
| `POST` | `/api/profile` | Updates biography, skills, and Web3 wallet attestation details. |