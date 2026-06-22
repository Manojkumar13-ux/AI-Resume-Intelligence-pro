                                               AI-RESUME-INTELLIGENCE-PRO
                                               
## 🚀 Live Demo

**Frontend:** https://ai-resume-intellegence-pro.vercel.app

**Backend:** (Coming soon)


login page
<img width="1920" height="1080" alt="Screenshot (3)" src="https://github.com/user-attachments/assets/c1fb085f-6db4-4aeb-91ba-745f44242080" />
<img width="1920" height="1080" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/fcdea96e-cf55-4be8-90e7-0efd3322d8e5" />

resume page
<img width="1920" height="1080" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/e25e276b-9980-43d9-b64d-802b291b9a70" />
analysis page
<img width="1920" height="1080" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/6c1aeab2-2bdd-46cd-8127-dfedd3972e8d" />

# 🧠 AI-Resume-Intelligence-Pro

**AI-powered resume analysis for your dream job**  
Analyze your resume against a target role and company, get an ATS score, actionable feedback, and smart suggestions – all in one modern web app.

---

## ✨ Features

- **🔐 Secure Authentication** – JWT-based login and registration with local storage persistence
- **📄 Resume Upload** – Click to upload PDF files (max 10MB) with validation
- **🤖 AI-Powered Analysis** – Parses the resume, extracts skills, and scores it against a given job description
- **📊 Detailed Feedback**:
  - Overall ATS Score (0-100)
  - Sub-scores: Format, Keywords, Experience
  - Strengths & Weaknesses
  - AI Suggestions for improvement
  - Found Skills & Missing Keywords
  - Recommended Roles based on resume content
- **📁 History & Management** – View all uploaded resumes with scores, view analysis again, and delete any resume
- **🎨 Modern UI/UX** – Glass-morphism design, smooth animations, hover effects, fully responsive

---

## 🧰 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React 18, TypeScript, React Router v6, Fetch API |
| **Styling** | Pure CSS (inline styles with keyframe animations) |
| **State** | React Hooks (`useState`, `useEffect`) + `localStorage` |
| **Backend** | Node.js + Express, JWT Authentication, Multer (file upload) |
| **Database** | MongoDB (stores user profiles, resume metadata, analysis results) |
| **AI/ML** | NLP pipeline for resume parsing, keyword extraction, and scoring |

---

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud)
- Backend server running

### 1. Clone the repository
```bash
git clone https://github.com/Manojkumar13-ux/AI-Resume-Intelligence-pro.git
cd AI-Resume-Intelligence-pro
. Install frontend dependencies
bash
cd frontend
npm install
3. Install backend dependencies
bash
cd ../backend
npm install

 Set up environment variables
Create a .env file in the backend folder:

env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/resume_db
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here

 Run the development servers
Frontend (from frontend folder):

bash
npm run dev
Runs on: http://localhost:5173

Backend (from backend folder):

bash
npm run dev
Runs on: http://localhost:5001

🗂️ Project Structure
text
AI-Resume-Intelligence-pro/
├── backend/
│   ├── src/
│   │   └── (API routes, models, controllers)
│   ├── uploads/          # Temporary file storage
│   ├── reports/          # Generated analysis reports
│   ├── .env              # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   └── main.tsx      # Main React application
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
├── README.md
└── LICENSE


🚀 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login (returns JWT)
POST	/api/resume/upload	Upload PDF (multipart/form-data)
POST	/api/resume/:id/analyze	Trigger AI analysis
GET	/api/resume/history	Get all resumes for logged-in user
DELETE	/api/resume/:id	Delete a resume
🔮 Future Enhancements
Multi-file comparison

PDF preview inside the app

Export analysis as PDF

Integration with job boards (LinkedIn, Indeed)

Role-specific templates

Improved AI feedback with bullet-level rewrites

Dark/Light theme toggle

📧 Contact
Manojkumar
GitHub: @Manojkumar13-ux
