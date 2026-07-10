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