# 🩸 Red Pulse

A full-stack Blood Donation Management System that connects blood donors, patients, and blood banks during emergencies. The platform helps users quickly search for eligible blood donors, check blood bank availability, and manage blood donation requests efficiently.

---

## 🚀 Live Demo

### Frontend
https://red-pulse-87c8.vercel.app/

### Backend API
https://red-pulse-ivory.vercel.app/

---

## 📖 Project Overview

Red Pulse is designed to simplify the blood donation process by providing a centralized platform for donors, patients, and blood banks.

The system enables:

- User Registration and Login
- Blood Bank Registration and Login
- Blood Donor Search
- Blood Bank Search
- Medical Information Management
- Blood Inventory Management
- Secure Authentication using JWT

---

## ✨ Features

### 👤 User Features

- Register and Login
- Search Eligible Blood Donors
- Search Blood Banks
- Update Medical Details
- View Donor Eligibility Status
- Create Blood Requests

### 🏥 Blood Bank Features

- Blood Bank Registration
- Blood Bank Login
- Manage Blood Inventory
- Update Blood Components
- View Blood Availability

### 🔒 Security

- JWT Authentication
- Password Encryption using bcrypt
- Protected API Routes
- CORS Enabled

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- CSS
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

### Deployment

- Frontend – Vercel
- Backend – Vercel
- Database – MongoDB Atlas

---

## 📂 Project Structure

```
Red-Pulse
│
├── public
├── src
│   ├── assets
│   ├── components
│   ├── pages
│   ├── App.jsx
│   └── main.jsx
│
├── red-pulse-backend
│   ├── api
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   ├── package.json
│   └── vercel.json
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/nandanasubhash021/Red-Pulse.git
```

### Install Frontend

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

### Install Backend

```bash
cd red-pulse-backend
npm install
```

### Run Backend

```bash
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **red-pulse-backend** folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

### Blood Bank

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/bloodbank/register` |
| POST | `/api/auth/bloodbank/login` |
| PUT | `/api/auth/bloodbank/profile` |
| PUT | `/api/auth/bloodbank/inventory` |

### Search

| Method | Endpoint |
|---------|----------|
| GET | `/api/auth/search` |
| GET | `/api/auth/search-blood-banks` |


---

## 🔮 Future Enhancements

- Email Notifications
- SMS Alerts
- GPS-Based Donor Tracking
- Admin Dashboard
- Real-Time Blood Availability Updates
- AI-Based Donor Recommendation System

---

## 👨‍💻 Developer

**Nandana Subhash**

GitHub: https://github.com/nandanasubhash021

**Nihala Fathima V N**

GitHub: https://github.com/nihalafathimavn

---

## 📄 License

This project was developed for educational and academic purposes.