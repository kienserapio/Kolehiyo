# 🎓 Kolehiyo: The Philippines’ College & Scholarship Tracker

Kolehiyo is a **personalized academic application assistant** built to simplify the fragmented and stressful process of applying to colleges and scholarships in the Philippines.  
It centralizes deadlines, requirements, mock exams, and progress tracking — empowering Filipino students to plan, prepare, and pursue their educational goals confidently.

---

## 📚 Background

Filipino students and parents often face **administrative anxiety** caused by the scattered nature of college entrance and scholarship application systems.  
Information about deadlines, requirements, and exam schedules is usually spread across multiple websites, leading to **missed opportunities** and **unnecessary stress** — especially for students without direct access to guidance or reliable resources.

Kolehiyo addresses this by serving as a **single, personalized source of truth** for all academic application needs in the Philippines.

---

## 🎯 Objectives

- 🧭 **Centralize** all college and scholarship application data into one accessible dashboard.  
- ⏰ **Minimize missed deadlines** through proactive alerts and guided checklists.  
- 🧠 **Enhance preparedness** via adaptive mock exams and gamified reviewers.  
- 📊 **Empower students** with visual progress tracking and smart reminders.

---

## ⚙️ System Overview

### 1. 🧍 Personalized Setup
- Upon sign-up, users create a profile based on their academic level (Senior High, Incoming College, or Current College Student).  
- They select target universities, degree programs, and preferred regions.  
- Optionally, users can explore available **scholarship opportunities** relevant to them.

---

### 2. 🏫 Centralized College Dashboard
- Displays all open and upcoming college application periods.  
- Users can sort/filter by **region, city, or status** (Open, Coming Soon, Closed).  
- Each card shows deadlines, exam schedules, and requirements.  
- Clicking a university syncs it automatically to their personal tracker.

---

### 3. 🎓 Scholarship Directory
- A dedicated tab showcasing **local and national scholarships**, sortable by region, province, or eligibility.  
- Each entry includes links to official pages, requirements, and deadlines.

---

### 4. 📋 My Board (Personal Tracker)
- Acts as the student’s **command center**, showing all chosen colleges and scholarships.  
- Includes:
  - Interactive checklist progress (e.g., 4/6 requirements done).  
  - Status markers like *Submitted*, *Exam Scheduled*, *Results Pending*.  
  - Optional **document upload and verification**.  

---

### 5. 🧩 Mock Exams & Reviewer Integration
- Includes **UPCAT-style** and **ACET-style** mock exams plus subject-based reviewers.  
- Offers adaptive difficulty through a diagnostic test.  
- Tracks progress using badges, streaks, and leaderboards.  
- Integrates scores into “My Board” for readiness tracking.

---

### 6. 🔔 Proactive Nudges & Smart Alerts
Smart reminders and notifications keep students on track:
- “UPCAT Application closes in 3 days.”
- “Mock exam result: You improved 15% in Math!”
- “Upload your transcript for Ateneo by tomorrow.”

---

## 💻 Tech Stack

### **Frontend**
- ⚛️ [React](https://react.dev/)
- ⚡ [Vite](https://vitejs.dev/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🧱 [shadcn/ui](https://ui.shadcn.com/)
- 🔷 [TypeScript](https://www.typescriptlang.org/)

### **Backend**
- 🟩 [Node.js](https://nodejs.org/)
- 🚂 [Express](https://expressjs.com/)
- 🐘 [PostgreSQL](https://www.postgresql.org/)
- 🧰 [Supabase](https://supabase.com/) — database + auth + storage
- 🔐 [Supabase Auth](https://supabase.com/) — authentication and user management

---

## 🏗️ Project Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/kolehiyo.git
cd kolehiyo
