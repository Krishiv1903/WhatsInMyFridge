# WhatsInMyFridge 🍳🥗

An AI-powered food recommendation web application that suggests recipes based on the ingredients available in your fridge.
The project combines a **React frontend**, **Node.js/Express backend**, and a **Python ML recommendation system** to provide intelligent meal suggestions.

---

## 🚀 Features

* 🥦 Ingredient-based recipe recommendations
* 🤖 Machine Learning powered food suggestion engine
* ⚡ Fast API communication between frontend, backend, and ML service
* 📊 Clean and responsive UI
* 🔍 Smart filtering and recommendation logic
* 🌐 Full-stack architecture with scalable structure

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* CSS

## Backend

* Node.js
* Express.js

## Machine Learning

* Python
* Pandas
* Scikit-learn

---

# 📂 Project Structure

```bash
WIMF
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── node_modules
│   ├── public
│   ├── routes
│   ├── services
│   ├── src
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
│
├── ml
│   ├── __pycache__
│   ├── cleaned_indian_food_1.csv
│   ├── ml_service.py
│   ├── model_utils.py
│   └── requirements.txt
│
├── package-lock.json
├── package.json
└── ReadMe.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Krishiv1903/WhatsInMyFridge.git
cd WhatsInMyFridge
```

---

# 🔧 Backend Setup

Move to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
```

Start backend server:

```bash
npm start
```

or

```bash
npm run dev
```

---

# 🤖 ML Service Setup

Move to ML folder:

```bash
cd ml
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run ML service:

```bash
python ml_service.py
```

---

# 💻 Frontend Setup

Move to frontend directory (root if frontend exists there):

```bash
npm install
```

Run frontend:

```bash
npm start
```

---

# 🔄 Application Workflow

1. User enters available ingredients
2. Frontend sends request to backend API
3. Backend communicates with ML service
4. ML model processes ingredient similarity
5. Recommended recipes are returned
6. Results displayed on frontend

---

# 🧠 Machine Learning Logic

The recommendation system:

* Cleans and preprocesses food dataset
* Matches ingredients using similarity techniques
* Suggests the most relevant recipes
* Optimizes recommendations based on available inputs

Dataset used:

```bash
cleaned_indian_food_1.csv
```

---

# 📌 API Architecture

```bash
Frontend (React)
        ↓
Backend API (Node.js/Express)
        ↓
Python ML Service
        ↓
Recommendation Engine
```

---

# 📦 Important Dependencies

## Backend

```bash
express
cors
dotenv
nodemon
```

## ML

```bash
pandas
numpy
scikit-learn
flask
```

---

# 🔐 Environment Variables

Example `.env`

```env
PORT=5000
ML_SERVICE_URL=http://localhost:8000
```

---

# 🚀 Future Improvements

* Nutritional analysis
* Meal planning system
* Image-based ingredient detection
* Voice input support
