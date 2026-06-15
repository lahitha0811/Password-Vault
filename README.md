# 🔐 Password Manager (Zero-Knowledge | MERN Stack)

A **secure Password Manager** built using the **MERN Stack (MongoDB, Express, React, Node.js)** with a **Zero-Knowledge Architecture**.

This application ensures that **passwords are encrypted on the client side before being sent to the server**, meaning **the server never sees or stores plaintext passwords or encryption keys**.

---

## ✨ Key Features

* 🔒 **Client-Side AES Encryption**
* 🧠 **Zero-Knowledge Architecture**
* 📧 **Master Key derived from user email**
* 🔁 **CRUD operations** (Create, Read, Update, Delete)
* 🔍 **Search passwords**
* ⚡ Secure and fast MERN stack implementation

---

## 🧠 Zero-Knowledge Security Model

* Passwords are **encrypted in the browser** before transmission.
* The **master encryption key is derived from the user’s email**.
* The backend **only stores encrypted data**.
* Even database access **cannot reveal passwords**.
* No server-side encryption or decryption is performed.

> ✅ This ensures complete privacy — only the user can decrypt their data.

---

## 🛠️ Tech Stack

* **Frontend:** React
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Encryption:** AES (Client-Side)
* **Architecture:** Zero-Knowledge

---

## 🚀 Getting Started

### 📥 Clone the Repository

```bash
git clone https://github.com/lahitha0811/Password-Manager-MERN.git
```

---

## ⚙️ Setting Up the Server

```bash
cd server
npm install
```

### ▶️ Start the Server

```bash
npm run dev
```

The backend will start running successfully.

---

### 🔐 Environment Variables

Create a `config.env` file inside the **server root folder**.

```env
DATABASE=<your MongoDB connection URI>
```

> ⚠️ **Note:**
> No encryption or secret keys are required on the server, as all encryption happens on the client.

---

## 💻 Setting Up the Client

```bash
cd client
npm install
```

### ▶️ Start the React App

```bash
npm start
```

The app will be available at:

```
http://localhost:3000
```

---

## 🗄️ Database Requirement

* Ensure your **MongoDB cluster is running and accessible**
* The database only stores **encrypted passwords**

---

## 🔐 Security Highlights

* ❌ No plaintext passwords stored
* ❌ No encryption keys stored on the server
* ✅ Client-side encryption
* ✅ Zero-knowledge design

---

## 📌 Future Improvements

* Password strength meter
* Auto-lock vault
* Browser extension support

---

## 🤝 Contributions

Feel free to fork the repository and submit pull requests for improvements or bug fixes.

---

## 📄 License

This project is licensed under the **MIT License**.

---

💙 Built with security and privacy as top priorities.
