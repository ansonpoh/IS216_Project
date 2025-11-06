# �� IS216 Web Application Development II

---

## Section & Group Number
**Example:** G3 Group 6

---

## Group Members

| Photo | Full Name | Role / Features Responsible For |
|:--:|:--|:--|
| <img src="photos/anson.jpg" width="80"> | Anson Poh Jing En | Backend Developer, Database & Auth - AI Chat, Supabase Integration |
| <img src="photos/sitinur.jpg" width="80"> | Sitinur | Frontend Developer - Opportunity Listing |
| <img src="photos/keying.jpg" width="80"> | Liang Keying | Backend Developer, UI/UX - Landing Page, AI Chat, Webpage Layout |
| <img src="photos/riya.jpg" width="80"> | Riya Philip | Frontend Developer, UI/UX - Opportunity Listing, Community Page |
| <img src="photos/joshua.jpg" width="80"> | Cher Zhi Rui Joshua | Frontend Developer - Interactive Map, Community Page |
| <img src="photos/yuanlong.png" width="80"> | Siew Yuanlong | Frontend Developer - Login/Signup, Profile, Dashboards |

> Place all headshot thumbnails in the `/photos` folder (JPEG or PNG).

---

## Business Problem

Describe the **real-world business or community problem** your project addresses.

> *Example:*  
> Small local businesses struggle to maintain an online presence, limiting visibility to customers.  
> Our web application helps them list menus, accept feedback, and attract more customers.

Current volunteer recruitment systems, like WhatsApp polls and manual coordination, are inefficient. They lead to long waiting times (weeks to months), poor visualization of opportunities, and a frustrating experience that discourages potential volunteers. This creates a significant barrier between passionate individuals and NGOs in need of support.

Our web application aims to simplify and accelerate the volunteer–NGO matching process by providing a centralized, easy-to-use platform. It addresses the inefficiencies of current systems (long waiting times, scattered opportunities, and poor visibility) by offering features like AI-powered opportunity recommendations, interactive maps, and real-time event management. Volunteers can quickly discover, track, and engage with opportunities that match their interests, while NGOs can efficiently manage sign-ups and communicate with participants.

---

## Web Solution Overview

### �� Intended Users
Anyone, especially students, who are looking for volunteering opportunities island-wide

### �� What Users Can Do & Benefits
Explain the core features and the benefit each provides.  

| Feature | Description | User Benefit |
|:--|:--|:--|
| Register & Login | Secure authentication system | Personalized experience and data security |
| AI Chat | AI Chat that interacts with users to recommend suitable volunteering opportunities | Saves time and effort by quickly guiding users to relevant opportunities |
| Interactive Map | Dynamic map displaying volunteering opportunities with regional and category filters, and custom markers | Easy and visually-appealing location-based opportunity lookup |
| Opportunities Listing | List of all opportunities available | Provides detailed information and simplifies the process of signing up for events |
| Communities Page | Social page where organisations and users can share images with captions of volunteering experiences | Encourages community engagement and sharing of memorable moments, motivating more volunteering |
| Analytics Page | Visual analytics of popular volunteering categories, regions, and a heatmap for insights | Allows users to see popular volunteering categories, regions and heatmap to help them make informed decisions on what to volunteer for |
| Organiser Dashboard | Tool for organisers to create events and manage volunteer sign-ups in one place | Allows organisers to create events and manage volunteer sign ups all in one place |
| Volunteer Dashboard | Dashboard for volunteers to set goals, track past and ongoing events, and manage pending applications in one place | Helps volunteers stay organized and monitor their volunteering progress efficiently

---

## Tech Stack

| Logo | Technology | Purpose / Usage |
|:--:|:--|:--|
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/html/html.png" width="40"> | **HTML5** | Structure and content |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/css/css.png" width="40"> | **CSS3 / Bootstrap** | Styling and responsiveness |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png" width="40"> | **JavaScript (ES6)** | Client-side logic and interactivity |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/nodejs/nodejs.png" width="40"> | **Node.js** | Backend runtime environment |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" width="40"> | **React** | Component-based frontend framework |
| <img src="https://raw.githubusercontent.com/github/explore/main/topics/supabase/supabase.png" width="40"> | **Supabase** | Authentication and database services |

---

## Use Case & User Journey

Provide screenshots and captions showing how users interact with your app.

1. **Landing Page**  
   <img src="screenshots/landing.png" width="600">  
   - Displays the homepage with navigation options.

2. **Search Feature**  
   <img src="screenshots/search.png" width="600">  
   - Users can browse and filter items by criteria.

3. **User Dashboard**  
   <img src="screenshots/dashboard.png" width="600">  
   - Shows saved data and recent activities.

> Save screenshots inside `/screenshots` with clear filenames.

---

## Developers Setup Guide

Comprehensive steps to help other developers or evaluators run and test your project.

---

### 0) Prerequisites
- [Git](https://git-scm.com/) v2.4+  
- [Node.js](https://nodejs.org/) v18+ and npm v9+  
- Access to backend or cloud services used (Firebase, MongoDB Atlas, AWS S3, etc.)

---

### 1) Download the Project
```bash
git clone https://github.com/ansonpoh/IS216_Project.git
cd IS216_Project
npm install
```

---

### 2) Configure Environment Variables
Create a `.env` file in the root/backend directory with the following structure:

```bash
DATABASE_URL=<your_backend_url>
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_api_key>
OR_API=<or_api>
OR_MODEL=<or_model>
GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>
OPENAI_API_KEY=<your_openai_api_key>
```

Create a `.env` file in the root/frontend directory with the following structure:
```bash
REACT_APP_SUPABASE_URL=<supabase_url>
REACT_APP_SUPABASE_ANON_KEY=<supabase_anon_key>
```

> Never commit the `.env` file to your repository.  
> Instead, include a `.env.example` file with placeholder values.

---

### 3) Backend / Cloud Service Setup

#### Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project.
3. Enable the following:
   - **Authentication** → Email/Password sign-in
   - **Firestore Database** or **Realtime Database**
   - **Hosting (optional)** if you plan to deploy your web app
4. Copy the Firebase configuration into your `.env` file.

#### Optional: Express.js / MongoDB
If your app includes a backend:
1. Create a `/server` folder for backend code.
2. Inside `/server`, create a `.env` file with:
   ```bash
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret_key>
   ```
3. Start the backend:
   ```bash
   cd server
   npm install
   npm start
   ```

---

### 4) Run the Frontend
To start the development server:
```bash
npm start
```
The project will run on [http://localhost:3000](http://localhost:3000) by default.

To build and preview the production version:
```bash
npm run build
npm run preview
```

---

### 5) Testing the Application

#### Manual Testing
Perform the following checks before submission:

| Area | Test Description | Expected Outcome |
|:--|:--|:--|
| Authentication | Register, Login, Logout | User successfully signs in/out |
| CRUD Operations | Add, Edit, Delete data | Database updates correctly |
| Responsiveness | Test on mobile & desktop | Layout adjusts without distortion |
| Navigation | All menu links functional | Pages route correctly |
| Error Handling | Invalid inputs or missing data | User-friendly error messages displayed |

#### Automated Testing (Optional)
If applicable:
```bash
npm run test
```

---

### 6) Common Issues & Fixes

| Issue | Cause | Fix |
|:--|:--|:--|
| `Module not found` | Missing dependencies | Run `npm install` again |
| `Firebase: permission-denied` | Firestore security rules not set | Check rules under Firestore → Rules |
| `CORS policy error` | Backend not allowing requests | Enable your domain in CORS settings |
| `.env` variables undefined | Missing `VITE_` prefix | Rename variables to start with `VITE_` |
| `npm run dev` fails | Node version mismatch | Check Node version (`node -v` ≥ 18) |

---

## Group Reflection

Each member should contribute 2–3 sentences on their learning and project experience.

> **Example Template:**  
> - *Alice:* Learned to build reusable Vue components and manage state effectively.  
> - *Ben:* Gained experience connecting frontend and backend APIs.  
> - *Chloe:* Improved UI/UX design workflow and collaboration using Figma.  
> - *David:* Understood how Firebase Authentication and Firestore integrate with modern SPAs.  

> - *Anson:* Learned more in detail about cloud databases and configuring an agentic AI. Gained more experience in overall web development.
> - *Sitinur:* 
> - *Keying:* 
> - *Riya:* Learned how to use reusable React components, design the frontend UI and understood how data is retrieved from the backend using routes and controllers
> - *Joshua:* Learned how to use Fort Awesome, Bootstrap icons, SVG over map API, as well as map filter logic.
> - *Yuanlong:* 

As a team, reflect on:
- Key takeaways from working with real-world frameworks  
- Challenges faced and how they were resolved  
- Insights on teamwork, project management, and problem-solving  
