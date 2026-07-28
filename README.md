<div align="center">
  <h1>Clinic Management ERP</h1>

  <p>
    <strong>A robust, enterprise-grade Clinic Management System built with the MERN stack.</strong>
  </p>

</div>

---

## TABLE OF CONTENTS

- [PROJECT HEADER](#-clinic-management-erp)
- [PROJECT OVERVIEW](#project-overview)
- [FEATURES](#features)
- [TECHNOLOGY STACK](#technology-stack)
- [SYSTEM ARCHITECTURE](#system-architecture)
- [PROJECT STRUCTURE](#project-structure)
- [FRONTEND DOCUMENTATION](#frontend-documentation)
- [BACKEND DOCUMENTATION](#backend-documentation)
- [DATABASE](#database)
- [COMPLETE API DOCUMENTATION](#complete-api-documentation)
- [AUTHENTICATION](#authentication)
- [VALIDATION](#validation)
- [BILLING](#billing)
- [AI OCR](#ai-ocr)
- [PHARMACY](#pharmacy)
- [REPORTING](#reporting)
- [API TESTING](#api-testing)
- [INSTALLATION](#installation)
- [ENVIRONMENT VARIABLES](#environment-variables)
- [DEPLOYMENT](#deployment)
- [SECURITY](#security)
- [PERFORMANCE](#performance)
- [CONTRIBUTORS](#contributors)
- [FAQ](#faq)
- [LICENSE](#license)
- [ACKNOWLEDGEMENTS](#acknowledgements)

---

## PROJECT OVERVIEW

### Purpose
The Clinic Management ERP is a comprehensive, centralized software solution designed to streamline the operations of medical clinics, healthcare centers, and independent medical practitioners. It bridges the gap between clinical care and administrative efficiency.

### Problem Statement
Modern clinics struggle with fragmented systems—using one software for billing, another for scheduling, paper records for patient histories, and a disjointed pharmacy system. This leads to data silos, administrative overhead, patient wait times, and a higher risk of medical errors.

### Goals & Objectives
- **Centralization**: To unify scheduling, electronic medical records (EMR), billing, and pharmacy operations into a single platform.
- **Efficiency**: To reduce administrative workload by automating invoice generation, stock deduction, and appointment reminders.
- **Accessibility**: To provide patients with a secure portal to view their prescriptions, lab orders, and payment history.
- **Data-Driven**: To provide clinic administrators with real-time analytics regarding revenue, patient footfall, and doctor performance.

### Benefits
- **For Doctors**: Streamlined consultation workflow, AI-powered OCR for legacy lab results, and one-click prescription generation.
- **For Receptionists**: Real-time appointment slot validation, waitlist management, and instant invoice creation.
- **For Pharmacists**: Automated FIFO inventory deduction, low-stock alerts, and pending prescription dashboards.
- **For Patients**: Enhanced experience with SMS/Email reminders, online billing via Razorpay, and transparent access to medical records.

### Real-world Use Cases
1. **Multi-Doctor Polyclinics**: Managing diverse doctor schedules, varying consultation fees, and centralized reception.
2. **Specialty Clinics**: Maintaining detailed SOAP notes and uploading scanned lab results using OCR for structured data tracking.
3. **In-house Pharmacy Integration**: Automatically routing doctor prescriptions to the pharmacy dashboard for seamless patient checkout.

### Target Users
- Doctors & Specialists
- Clinic Administrators / Managers
- Receptionists & Front Desk Staff
- Pharmacists & Lab Technicians
- Patients

---

## FEATURES

| Module | Features |
|--------|----------|
| **1. Authentication** | Secure Session-based login, Role-Based Access Control (Admin, Doctor, Receptionist, Pharmacist, Patient), secure password hashing via bcrypt. |
| **2. Patient Management** | Complete demographic tracking, patient medical history, unique ID generation, detailed search and filtering via API. |
| **3. Appointment Scheduling** | Slot validation to prevent double-booking, waitlist management, live queue tracking for checked-in patients, automated email reminders. |
| **4. Consultation & EMR** | SOAP (Subjective, Objective, Assessment, Plan) notes, historical consultation views, dynamic prescription linking, lab order assignment. |
| **5. Prescription Management** | Integrated drug database, dosage/frequency tracking, automated PDF generation for patient downloads. |
| **6. Laboratory Orders** | Direct ordering from consultations, uploading of legacy PDF/Image results, AI-powered OCR data extraction via Hugging Face. |
| **7. Pharmacy & Inventory** | Item master catalog, batch tracking, expiry date monitoring, low-stock alerts, automated FIFO (First-In-First-Out) stock deduction upon dispensing. |
| **8. Billing & Payments** | Automated invoice generation including taxes and discounts, Razorpay integration for online payments, manual payment tracking (Cash/Card/UPI), partial payment handling, insurance claim tracking. |
| **9. Patient Portal** | Secure, restricted access for patients to view their own medical records, prescriptions, upcoming appointments, and outstanding invoices. |
| **10. Reporting & Analytics** | Revenue analytics, doctor performance metrics, patient demographics analysis, automated report generation. |
| **11. System Administration** | User management, role assignment, system-wide configuration, audit logging. |

---

## TECHNOLOGY STACK

### Frontend
| Technology | Description |
|------------|-------------|
| **React.js** | Core UI framework (v18+) |
| **React Router** | For SPA routing and protected routes |
| **Tailwind CSS** | Utility-first CSS framework for rapid, responsive UI development |
| **Axios** | Promise-based HTTP client for API interactions |
| **Context API / Redux** | Global state management |
| **Chart.js / Recharts** | Dashboard visualizations |

### Backend
| Technology | Description |
|------------|-------------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **PDFKit** | Server-side PDF generation for prescriptions and invoices |
| **pdf-parse & Multer** | Handling file uploads and reading PDF documents |

### Database
| Technology | Description |
|------------|-------------|
| **MongoDB Atlas** | Managed Cloud NoSQL Database |
| **Mongoose** | Elegant MongoDB object modeling for Node.js |

### Authentication & Security
| Technology | Description |
|------------|-------------|
| **Express Session** | Secure, HttpOnly cookie-based session management |
| **Bcrypt.js** | Password hashing |
| **Helmet & CORS** | HTTP headers and Cross-Origin Resource Sharing protection |

### AI & Payments
| Technology | Description |
|------------|-------------|
| **Hugging Face Inference** | `stepfun-ai/GOT-OCR2_0` for Optical Character Recognition of lab reports |
| **Razorpay** | Payment gateway integration with signature verification |

### Deployment & Dev Tools
| Technology | Description |
|------------|-------------|
| **Render** | Cloud hosting for the backend application |
| **Vercel / Netlify** | Frontend hosting |
| **Postman** | Comprehensive API testing collections |
| **Nodemon** | Development auto-reloading |

---

## SYSTEM ARCHITECTURE

The application uses a straightforward layout:

1. **Frontend (React)**: This is what the users see. It runs in the web browser and allows doctors, receptionists, and patients to interact with the system.
2. **Backend (Node.js & Express)**: This is the brain of the system. It receives requests from the frontend, securely processes the data (like checking available appointment slots or calculating bills), and then talks to the database.
3. **Database (MongoDB)**: This is where all the data is securely stored, including patient records, appointments, and billing histories.
4. **External Services**: We securely connect to Razorpay to process online payments and Hugging Face to extract text from scanned lab reports.

---

## PROJECT STRUCTURE

```text
Clinic-Management-ERP/
├── backend/
│   ├── config/             # Database connection, env configs
│   ├── constants/          # Shared constants (Roles, Statuses)
│   ├── controllers/        # Request handlers (Business Logic)
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── billingController.js
│   │   ├── consultationController.js
│   │   ├── labOrderController.js
│   │   ├── patientController.js
│   │   ├── pharmacyController.js
│   │   ├── prescriptionController.js
│   │   └── ...
│   ├── middlewares/        # Express middlewares
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/             # Mongoose schemas
│   │   ├── Appointment.js
│   │   ├── Consultation.js
│   │   ├── Invoice.js
│   │   ├── LabOrder.js
│   │   ├── Medicine.js
│   │   ├── Patient.js
│   │   ├── Prescription.js
│   │   └── User.js
│   ├── routes/             # API Route definitions
│   │   ├── appointmentRoutes.js
│   │   ├── billingRoutes.js
│   │   ├── consultationRoutes.js
│   │   ├── labOrderRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── pharmacyRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   └── ...
│   ├── utils/              # Helper functions
│   │   ├── auditLogger.js
│   │   └── sendEmail.js
│   ├── app.js              # Express app setup and middleware mounting
│   ├── server.js           # Server entry point
│   └── seeder.js           # Database seeding script
├── frontend/               # React application (Structure depends on implementation)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route page components
│   │   ├── services/       # Axios API wrapper functions
│   │   ├── context/        # React Context providers
│   │   ├── utils/          # Frontend helpers
│   │   └── App.js          # Root component
│   └── package.json
├── package.json
└── README.md
```

### Important Files
- **`backend/app.js`**: Core Express setup, CORS configuration, JSON parsing, and API route mounting.
- **`backend/server.js`**: Boots up the application and connects to the database.
- **`backend/middlewares/authMiddleware.js`**: Contains `protect` and `authorize` functions crucial for session security and RBAC.

---

## FRONTEND DOCUMENTATION

### Layouts & Routing
The frontend utilizes `react-router-dom` for Single Page Application (SPA) navigation. 
- **Public Layout**: Contains Login, Password Reset, and 404 pages.
- **Dashboard Layout**: Protected wrapper containing a Sidebar, Navbar, and dynamic `<Outlet />` for rendering specific modules based on user roles.

### Protected Routes & Role Based UI
A high-order component (HOC) or Route Wrapper checks the user's authentication context. If unauthenticated, they are redirected to `/login`. Furthermore, route configurations include an `allowedRoles` array. If a Receptionist tries to access `/admin/users`, they are redirected to an "Unauthorized" page.

### Axios Configuration
An Axios instance is configured in `src/services/api.js` to automatically attach credentials (`withCredentials: true`) to ensure session cookies are sent with every request. It also includes response interceptors to handle `401 Unauthorized` responses globally, redirecting the user to login.

### State Management
- **Local State**: Managed via `useState` and `useReducer` for form inputs and UI toggles.
- **Global State**: React Context API is used for User Authentication state, Theme preferences, and global notification toasts.

---

## BACKEND DOCUMENTATION

### Design Pattern
The backend adheres strictly to the **MVC (Model-View-Controller)** pattern (sans Views, as it acts purely as an API).
- **Routes** map HTTP methods and URIs to specific controller functions.
- **Controllers** handle request parsing, business logic, and response formatting.
- **Models** define data structure, relationships, and pre/post save hooks.

### Error Handling
All controllers are wrapped in `try/catch` blocks. Errors are caught and returned uniformly as `{ success: false, message: "Error description" }` with appropriate HTTP status codes (400, 401, 403, 404, 500).

### Validation Middleware
Custom middleware in `validationMiddleware.js` checks for required `ObjectId` formats, mandatory body fields, and array structures *before* the request reaches the controller, reducing database overhead.

---

## DATABASE

The system uses a highly normalized MongoDB schema design optimized for fast reads while maintaining data integrity.

### Key Collections & Relationships
- **`users`**: System operators (Doctors, Admins). Referenced by `createdBy`, `doctorId`.
- **`patients`**: Core patient records. Referenced across the entire application.
- **`appointments`**: Links a `patientId` and `doctorId`.
- **`consultations`**: Linked 1-to-1 with `appointments`.
- **`prescriptions` & `laborders`**: 1-to-Many relationships originating from a `consultation`.
- **`invoices`**: Can be linked to a `patientId` and optionally a `consultationId`. Contains embedded documents for `items` and `paymentHistory`.
- **`medicines`**: The pharmacy item master. Contains embedded documents for `batches`.

### Indexes
Performance is ensured by strategic indexes:
- `Patient`: Index on `phone` (Unique), `email` (Unique).
- `Appointment`: Compound index on `doctorId` and `appointmentDate` for fast slot validation.
- `Invoice`: Index on `invoiceNumber` (Unique).

### Example Document (`Consultation`)
```json
{
  "_id": "60d5ecb8b392...",
  "appointmentId": "60d5ec...123",
  "patientId": "60d5ec...456",
  "doctorId": "60d5ec...789",
  "symptoms": "Severe headache, nausea",
  "examinationFindings": "High blood pressure",
  "diagnosis": "Migraine",
  "treatmentPlan": "Rest, hydration, prescribed medications",
  "status": "Completed",
  "createdAt": "2026-07-28T10:00:00.000Z"
}
```

---

## COMPLETE API DOCUMENTATION

> **Note**: All API responses follow a standard format: `{ success: boolean, message?: string, data?: object | array, count?: number }`

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/login` | Authenticates user and creates session | No | All |
| POST | `/logout` | Destroys active session | Yes | All |
| GET | `/me` | Returns current logged-in user profile | Yes | All |

### 2. Patients (`/api/patients`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/` | Register new patient | Yes | Admin, Reception, Doctor |
| GET | `/` | List patients (supports `search`, `gender`, `ageMin`, `ageMax`) | Yes | All except Patient |
| GET | `/:id` | Get patient by ID | Yes | All except Patient |
| PUT | `/:id` | Update patient details | Yes | Admin, Reception |

### 3. Appointments (`/api/appointments`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/` | Create appointment (Includes slot overlap validation) | Yes | Admin, Reception, Patient |
| GET | `/` | List appointments (Supports `startDate`, `endDate`, `doctorId`) | Yes | Admin, Reception, Doctor |
| GET | `/:id` | Get appointment by ID | Yes | Admin, Reception, Doctor |
| PUT | `/:id` | Update/Reschedule appointment | Yes | Admin, Reception |
| GET | `/available-slots` | Get available slots for a doctor on a specific date | Yes | All |
| GET | `/queue/:doctorId` | Get live queue of checked-in patients for today | Yes | Admin, Reception, Doctor |

### 4. Consultations (`/api/consultations`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/` | Create a SOAP consultation note | Yes | Doctor, Admin |
| GET | `/` | List all consultations (Supports `patientId`, `doctorId`, `status`, `search`) | Yes | Doctor, Admin, Reception |
| GET | `/:id` | Get consultation by consultation ID (Includes Prescriptions & Labs) | Yes | Doctor, Admin, Reception |
| GET | `/appointment/:appointmentId` | Get consultation associated with an appointment | Yes | Doctor, Admin, Reception |
| POST | `/:id/prescription` | Add prescription to consultation | Yes | Doctor |
| GET | `/:id/prescription/download`| Download generated PDF of prescription | Yes | All |
| POST | `/:id/lab-orders` | Create a lab order linked to consultation | Yes | Doctor |
| PUT | `/lab-orders/:orderId/results` | Upload multipart form data (File) to attach lab results with AI OCR processing | Yes | Doctor, Admin, Reception |

### 5. Prescriptions (`/api/prescriptions`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | List prescriptions (Supports `patientId`, `doctorId`, `status`) | Yes | Doctor, Admin, Reception |
| GET | `/:id` | Get prescription by ID | Yes | Doctor, Admin, Reception |

### 6. Lab Orders (`/api/lab-orders`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | List lab orders (Supports filters) | Yes | Doctor, Admin, Reception |
| GET | `/:id` | Get lab order by ID | Yes | Doctor, Admin, Reception |

### 7. Pharmacy (`/api/pharmacy`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/medicines` | Add medicine to Item Master | Yes | Admin, Pharmacist |
| GET | `/medicines` | Get catalog with virtual stock calculations | Yes | Admin, Pharmacist, Doctor |
| POST | `/purchases` | Record stock-in and update batch expiries | Yes | Admin, Pharmacist |
| GET | `/prescriptions/pending` | Fetch prescriptions ready for dispensing | Yes | Admin, Pharmacist, Reception |
| POST | `/dispense/:prescriptionId`| Dispense medicines. Derives items automatically from prescription, performs FIFO stock deduction. | Yes | Admin, Pharmacist, Reception |
| GET | `/alerts` | Get low-stock and expiry warnings | Yes | Admin, Pharmacist, Reception |

### 8. Billing (`/api/billing`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/invoices` | Generate invoice (Subtotal, Tax, Discount calculated) | Yes | Admin, Reception |
| GET | `/invoices` | List invoices with pagination | Yes | Admin, Reception |
| GET | `/invoices/:id` | View specific invoice | Yes | Admin, Reception, Patient |
| POST | `/invoices/:id/razorpay-order`| Initialize online payment gateway order | Yes | Admin, Reception, Patient |
| POST | `/invoices/:id/verify-payment`| Verify webhook/callback signature from Razorpay | Yes | Admin, Reception, Patient |
| POST | `/invoices/:id/manual-payment`| Record Cash/Card/UPI transactions, update status | Yes | Admin, Reception |

---

## AUTHENTICATION

The system relies on **Stateful Session Authentication** via `express-session` backed by a memory store (or Redis in production).
- **Cookies**: Sessions are stored via `HttpOnly` cookies, making them immune to standard XSS attacks.
- **Login Flow**: Client sends credentials -> Server verifies via `bcrypt` -> Session is initialized -> Cookie is attached to the response.
- **RBAC**: The `authorize(...roles)` middleware blocks access if `req.user.role` is not present in the allowed list.

---

## VALIDATION

Custom validation middleware prevents malformed requests from reaching controllers.
- `validateObjectId('paramName')`: Ensures MongoDB IDs passed in URLs are valid 24-character hex strings, preventing casting errors.
- `validateBody(...fields)`: Ensures specific keys exist in `req.body`.
- `validateArray('fieldName')`: Ensures a specific body parameter is a populated array.

---

## BILLING

The Billing module handles complex financial workflows:
1. **Invoice Generation**: Accepts line items, calculates subtotal, applies percentage tax and flat discount, determining the `grandTotal` and `amountDue`.
2. **Partial Payments**: Payments can be recorded manually (Cash) or online. The `amountDue` is decremented. If `amountDue === 0`, status changes to `Paid`. If > 0, status is `Partial`.
3. **Razorpay Integration**:
   - Step 1: Create Order -> Generates a Razorpay `order_id`.
   - Step 2: Client processes UI payment.
   - Step 3: Verify Payment -> Backend utilizes `crypto.createHmac` to verify the `razorpay_signature` using the environment `RAZORPAY_KEY_SECRET`.

---

## AI OCR (Optical Character Recognition)

A standout feature for Clinic Management ERP is the handling of legacy lab reports.
- **Process**: When a Receptionist or Doctor uploads a scanned image (JPEG/PNG) of a lab result via `PUT /api/consultations/lab-orders/:orderId/results`.
- **Multer**: intercepts the file and stores it in memory.
- **Hugging Face API**: The image buffer is sent to the Hugging Face Inference API utilizing the `stepfun-ai/GOT-OCR2_0` model (or similar configured model).
- **Extraction**: The text is extracted and stored in the database alongside the lab order, making legacy paper reports fully searchable within the EMR.

---

## PHARMACY

Inventory management relies on stringent tracking:
- **Batches**: When medicines are purchased, they are saved as discrete `batches` featuring a `batchNumber`, `quantity`, and `expiryDate`.
- **FIFO Dispensing**: When `dispensePrescription` is called, the system sorts available batches by `expiryDate` (oldest first). It deducts stock sequentially across batches until the `requestedQuantity` is fulfilled.
- **Alerts**: A dedicated endpoint provides real-time alerts for medicines dropping below their `reorderThreshold` or batches expiring within 30 days.

---

## REPORTING

*(Module overview - Implementation specifics exist in `reportingController.js`)*
Provides aggregate data endpoints:
- Daily/Monthly revenue calculations.
- Patient footfall trends.
- Doctor-wise consultation counts.
Outputs can be consumed by Chart.js on the frontend for visual dashboards.

---

## API TESTING

A comprehensive `postman_collection.json` is included in the project root.
### Test Coverage Includes:
- **Positive Paths**: Successful login, complete end-to-end appointment -> consultation -> billing flow.
- **Negative Paths**: Attempting to book overlapping slots, attempting to dispense out-of-stock items, testing invalid ObjectIds.
- **Auth Tests**: Accessing protected routes without cookies, accessing Admin routes as a Receptionist.

---

## INSTALLATION

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas Account (or local MongoDB server)
- Razorpay Account (for payment keys)
- Hugging Face Account (for OCR API token)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/Clinic-Management-ERP.git
   cd Clinic-Management-ERP/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables (See below).
4. Run Development Server:
   ```bash
   npm run dev
   ```

### Frontend Setup
*(Assuming standard React/Vite structure)*
1. Navigate to frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Development Server:
   ```bash
   npm run dev
   ```

---

## ENVIRONMENT VARIABLES

Create a `.env` file in the `backend/` directory.

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/clinic-erp?retryWrites=true&w=majority

# Security
SESSION_SECRET=super_secret_random_string_for_express_session

# Razorpay (Payments)
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Hugging Face (AI OCR)
HF_ACCESS_TOKEN=hf_xxxxxxxxxxxxxxxxx
HF_MODEL_ID=stepfun-ai/GOT-OCR2_0

# Email (Optional/Future)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=user
SMTP_PASS=pass
```

---

## DEPLOYMENT

### Backend Deployment via Render
1. Connect your GitHub repository to Render.
2. Create a new "Web Service".
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all Environment Variables in the Render dashboard.

### Database
Ensure MongoDB Atlas Network Access is set to `0.0.0.0/0` (Allow from anywhere) to permit Render's dynamic IP addresses to connect.

---

## SECURITY

- **NoSQL Injection**: Prevented by utilizing Mongoose schemas which cast variables to strict types (e.g., ObjectIds), and validation middlewares.
- **CORS**: Configured to only accept requests from the specific Frontend origin, preventing unauthorized cross-origin requests.
- **Credentials**: `withCredentials: true` is strictly enforced to manage `HttpOnly` session cookies securely.

### Future Improvements
- Implement `helmet` for HTTP header hardening.
- Implement `express-rate-limit` to prevent brute force attacks on the login route.

---

## PERFORMANCE

- **Indexes**: MongoDB compound indexes applied to `(doctorId, appointmentDate)` ensure slot validation queries remain fast even at scale.
- **Lean Queries**: Use of `.select()` in Mongoose populations ensures only necessary fields (like `firstName`, `lastName`) are transmitted over the wire, saving bandwidth.
- **Pagination**: The `/api/billing/invoices` route implements `limit` and `skip` to handle thousands of invoices efficiently.

---


## CONTRIBUTORS

### **Divyanshu Dubey**
- **Role:** Backend Developer
- **GitHub:** [DivyanshuDubey10](https://github.com/DivyanshuDubey10)
- **LinkedIn:** [Divyanshu Dubey](https://www.linkedin.com/in/divyanshu-dubey-19a15b251/)


### **Vedanga Koch**
- **Role:** Frontend Developer
- **GitHub:** [vdngkch](https://github.com/vdngkch)
- **LinkedIn:** [Vedanga Koch](https://www.linkedin.com/in/vedanga-koch-a65a7b330/)

### **Deepayan Ghosh**
- **Role:** Database Designer
- **LinkedIn:** [Deepayan Ghosh](https://www.linkedin.com/in/deepayan-ghosh-a3bb0b328/)

---

## FAQ

**Q1: How does the AI OCR feature work?**
A: When a lab report image is uploaded, it is sent to Hugging Face's Inference API using an advanced OCR model. The extracted text is then saved in the database, allowing doctors to search historical lab metrics easily.

**Q2: Is this system HIPAA compliant?**
A: Out of the box, this is a foundation. To achieve full HIPAA compliance, you must ensure encrypted databases at rest, implement BAA agreements with cloud providers (AWS/MongoDB Atlas), and enforce strict session timeouts and audit logging.

**Q3: Can I run this locally without the internet?**
A: The core application can run locally. However, Razorpay payments and Hugging Face OCR require an active internet connection.

**Q4: How does the system handle double-booking?**
A: The appointment creation API checks the database for any existing appointment for the given doctor that falls within the `startTime` to `startTime + duration` window. If an overlap is detected, the request is rejected.

**Q5: What happens when a medicine expires?**
A: The pharmacy alert endpoint flags batches nearing expiry. During dispensing, the system utilizes FIFO (First In First Out), ensuring older stock is sold first. Expired stock is filtered out and cannot be dispensed.

*(Add more FAQs based on stakeholder inquiries...)*

---

## LICENSE

Distributed under the MIT License. See `LICENSE` for more information.

---

## ACKNOWLEDGEMENTS

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Razorpay](https://razorpay.com/)
- [Hugging Face](https://huggingface.co/)
- [Tailwind CSS](https://tailwindcss.com/)
- FontAwesome & HeroIcons for UI elements.
- The open-source community for countless invaluable libraries.


