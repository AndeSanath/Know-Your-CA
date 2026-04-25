# 💼 KnowYourCA

KnowYourCA is a full-stack MERN application designed to connect users with verified Chartered Accountants (CAs) through a modern, secure, and real-time platform.  

It enables users to discover CAs based on specialization and location, explore professional portfolios, leave reviews, and communicate instantly via a subscription-based chat system.

Built with a scalable architecture and premium UI design, KnowYourCA delivers a commercial-grade experience.

---

## ✨ Key Features

### 🔐 Authentication & Role-Based Access
- Secure login using JWT Authentication
- Role distinction between Users and CAs
- Dynamic UI based on user roles

---

### 🔍 CA Discovery & Smart Search
- Search CAs by:
  - Specialization  
  - Location  
- Fast and intuitive filtering system

---

### 👨‍💼 CA Profiles & Portfolios
- Detailed professional profiles  
- Portfolio showcasing expertise and services  

---

### ⭐ Rating & Review System
- Users can leave:
  - Star ratings ⭐  
  - Written feedback  
- Automatic average rating calculation  
- Live updates on every new review  

---

### 💬 Real-Time Messaging
- Instant chat using Socket.io  
- Subscription-based gated messaging system  

---

### 🔔 Real-Time Notifications
- Integrated react-hot-toast  
- Instant alerts for new messages  
- Works across all pages (multi-tasking support)

---

### 📊 CA Analytics Dashboard
- Dedicated dashboard for CAs  
- Displays:
  - Total conversations  
  - Average rating  
- Quick actions:
  - Inbox access  
  - Profile editing  

---

### 🛡️ Advanced Security
- Password hashing with bcryptjs  
- Protected API keys using .gitignore  
- Secure authentication flow  

---

### 🎨 Premium UI/UX
- Glassmorphism design  
- Smooth animations (fade-up effects)  
- Fully responsive layout  
- Clean and modern navigation  

---

## 🛠️ Tech Stack

### 💻 Frontend
- React.js  
- React Router  
- Context API (AuthContext)  
- Vanilla CSS (Glassmorphism, Gradients, Animations)  

---

### ⚙️ Backend
- Node.js  
- Express.js  
- JWT Authentication  
- bcryptjs  
- Socket.io  
- Multer (File Uploads)  

---

### 🗄️ Database
- MongoDB  
- Mongoose  

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js installed  
- MongoDB running locally  

---

## 📥 Installation

### 1. Clone Repository
bash git clone https://github.com/yourusername/KnowYourCA.git cd KnowYourCA 

---

### 2. Backend Setup

bash cd server npm install 

Create .env file:

env PORT=5000 MONGO_URI=your_mongodb_connection JWT_SECRET=your_secret_key 

Run backend:

bash npm run dev 

---

### 3. Frontend Setup

bash cd client npm install npm run dev 

---

## 🌐 Run the App

Open in browser:

http://localhost:5173

---

## 🧪 How to Explore Features

### 📊 View Dashboard
Login as a CA:
Email: rahul.sharma@example.com   Password: password123

---

### ⭐ View Reviews
- Open any CA profile  
- Scroll to Client Feedback section  

---

### 🔔 Test Notifications
- Open two browser windows  
- Login as:
  - User in one  
  - CA in another  
- Send a message → see instant notification  

---

## 🎯 Project Highlights

- Real-time full-stack application  
- Role-based architecture  
- ML-ready scalable design  
- Production-level UI/UX  
- Secure and modular backend  

---

## 🏆 Conclusion

KnowYourCA is a complete interactive ecosystem that bridges the gap between users and financial experts with real-time communication, intelligent discovery, and a premium experience.

---

## ⭐ Show Your Support

If you like this project:
- ⭐ Star the repository  
- 🍴 Fork it  
- 🧑‍💻 Contribute
