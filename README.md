# EduLoan Navigator

EduLoan Navigator is a professional full-stack FinTech application for student education loan planning, moratorium interest simulation, repayment modeling, and prepayment optimization.

## Developed By
*   **Developer**: PODUGU MUKESH
*   **Email**: [mukeshpodugu123@gmail.com](mailto:mukeshpodugu123@gmail.com)
*   **Phone**: +91 8143999463
*   **LinkedIn**: [LinkedIn Profile](https://www.linkedin.com/in/podugu-mukesh-1575a32b4/)
*   **GitHub**: [GitHub Profile](https://github.com/mukeshpodugu)

---

## Technical Stack
*   **Frontend**: React, Vite, Tailwind CSS, Recharts (Charts), Framer Motion (Animations), Lucide React (Icons), jsPDF & jsPDF AutoTable (PDF Report), XLSX (Excel Report)
*   **Backend**: Java 21, Spring Boot 3, Spring Security, JWT (JSON Web Token), JPA/Hibernate (Data Access), Swagger/OpenAPI (API Docs)
*   **Database**: MySQL
*   **Deployment**: Vercel (Frontend), Railway (Backend & Database)

---

## Directory Structure
```text
eduloan-navigator/
├── db/
│   └── schema.sql             # MySQL schema definitions and default configuration seeds
├── backend/
│   ├── src/main/java/...      # Spring Boot java source code
│   ├── src/main/resources/    # Application properties configuration
│   ├── Dockerfile             # Multi-stage container instructions for Railway
│   └── pom.xml                # Maven project object model and dependencies
└── frontend/
    ├── src/
    │   ├── components/        # Protected routes, Navbar, Footer
    │   ├── context/           # AuthContext managing JWT tokens and session persistency
    │   ├── pages/             # landing, calculators, dashboard, admin, contact pages
    │   ├── utils/             # finance.js mathematical calculator modules
    │   ├── App.jsx            # Routing and paths setup
    │   ├── index.css          # Design system stylesheet
    │   └── main.jsx           # Mounting scripts
    ├── index.html             # SEO meta configurations
    ├── tailwind.config.js     # Color tokens and gradient setups
    └── vercel.json            # Vercel SPA redirects
```

---

## Features
1.  **Landing Page**: Elegant layout summarizing the capabilities.
2.  **EMI Calculator**: Real-time slider adjustments computing installments and principal vs interest.
3.  **Moratorium Calculator**: Simulates interest accumulation (compounding, simple, interest-paid deferred) during studies.
4.  **Repayment Simulator**: Models progressive income step-ups or floats rate shock scenarios.
5.  **Prepayment Optimizer**: Formulates lump-sum and monthly prepayments to cut down tenure.
6.  **Loan Comparison**: Compares up to 3 bank schemes side-by-side.
7.  **Financial Dashboard**: Displays aggregate portfolio liability and manages logged-in user simulations.
8.  **Amortization Schedule**: Paginated breakdown of installments with PDF and Excel export buttons.
9.  **Contact Us**: Support query form storing inquiries in the database with interactive FAQs.
10. **Admin Dashboard**: Platform usage metrics, inquiries queue to post replies, and bench rate modifications.

---

## Local Setup Instructions

### 1. Database Setup
Create a MySQL database named `eduloan_navigator` and execute `db/schema.sql` to import the base tables.
```bash
mysql -u root -p -e "source db/schema.sql"
```

### 2. Backend Server
Navigate to the `backend` folder and run:
```bash
mvn spring-boot:run
```
*   The API server runs on port `8080` by default.
*   Swagger documentation is viewable at: `http://localhost:8080/swagger-ui.html`

### 3. Frontend App
Navigate to the `frontend` folder and run:
```bash
npm install
npm run dev
```
*   The React app runs on port `5173` or `3000` by default.

---

## Production Deployment Steps

### 1. Database (Railway)
*   Deploy a MySQL service on Railway.
*   Provide connection details to the Spring Boot instance.

### 2. Backend (Railway)
*   Link your GitHub repository to Railway.
*   Add the following environment variables:
    *   `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:<port>/<dbname>`
    *   `SPRING_DATASOURCE_USERNAME`: `<username>`
    *   `SPRING_DATASOURCE_PASSWORD`: `<password>`
    *   `JWT_SECRET`: A custom 64-character hex secret string.
    *   `PORT`: `8080` (Railway injects this automatically)
*   Railway automatically reads `backend/Dockerfile`, builds the multi-stage container, and provisions the API endpoints.

### 3. Frontend (Vercel)
*   Deploy the `frontend/` folder on Vercel.
*   Set the environment variable `VITE_API_URL` to point to your Railway backend API e.g. `https://eduloan-backend.railway.app/api`.
*   CORS configuration is pre-enabled for Vercel domains on the Spring Boot SecurityConfig class.
