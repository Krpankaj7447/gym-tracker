# 💪 GymLog — MERN Stack Workout Tracker

## Folder Structure
```
gymlog/
├── backend/      ← Node.js + Express + MongoDB
└── frontend/     ← React app
```

---

## Prerequisites (pehle install karo)
- Node.js: https://nodejs.org  (v18+)
- MongoDB Community: https://www.mongodb.com/try/download/community
- Git (optional)

---

## Step 1 — MongoDB Start Karo

**Windows:**
```
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

## Step 2 — Backend Setup

```bash
cd gymlog/backend

# .env file banao
cp .env.example .env
# .env open karo aur JWT_SECRET change karo (kuch bhi likho)

# Dependencies install karo
npm install

# Server start karo
npm run dev
```

Server `http://localhost:5000` pe chalega ✅

---

## Step 3 — Frontend Setup

Naya terminal kholo:

```bash
cd gymlog/frontend

# Dependencies install karo
npm install

# React app start karo
npm start
```

App `http://localhost:3000` pe khulegi 🚀

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Profile get |
| PUT | /api/auth/profile | Profile update |

### Workout Logs
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/logs | All logs |
| GET | /api/logs/stats | Streak + totals |
| GET | /api/logs/:id | Single log |
| POST | /api/logs | New log |
| PUT | /api/logs/:id | Update log |
| DELETE | /api/logs/:id | Delete log |

### Splits
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/splits | All splits |
| POST | /api/splits | New split |
| PUT | /api/splits/:id | Update |
| DELETE | /api/splits/:id | Delete |

### Exercises
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/exercises | All exercises |
| POST | /api/exercises | Custom add |
| DELETE | /api/exercises/:id | Delete custom |

### Measurements
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/measurements | All measurements |
| POST | /api/measurements | Add new |
| DELETE | /api/measurements/:id | Delete |

---

## Common Errors

**MongoDB connect nahi ho raha:**
```
MongoDB ko start karo (Step 1 dekho)
```

**Port 5000 already in use:**
```
.env mein PORT=5001 karo
```

**npm install error:**
```bash
npm install --legacy-peer-deps
```

---

## Features
- ✅ JWT Authentication
- ✅ Workout Log (Date + Day + Exercise + Sets + Reps + Weight)
- ✅ Workout Splits (Default PPL + Custom)
- ✅ Exercise Library (16 pre-built + custom add)
- ✅ Body Measurements (monthly tracking)
- ✅ Profile page (height, weight, goal)
- ✅ Streak counter
- ✅ Mobile-first UI
