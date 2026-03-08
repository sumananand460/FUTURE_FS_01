# Suman Anand — Personal Portfolio

**CS Engineering Student & Aspiring Full Stack Developer**
B.Tech CSE @ Raajdhani Engineering College, Bhubaneswar | Expected Graduation: 2027

🔗 [GitHub](https://github.com/sumananand460) · [LinkedIn](https://www.linkedin.com/in/suman-anand-104b55313/) · [Email](mailto:sumananand470@gmail.com)

> Built as **Task 1** for the **Future Interns — Full Stack Web Development Track**

---

## About

A modern, fully responsive personal portfolio website built from scratch with a Node.js/Express backend powering a real working contact form that delivers emails directly to my inbox.

Designed with a dark-first aesthetic featuring animated particle backgrounds, shooting stars, smooth scroll-reveal animations, and a seamless dark/light mode toggle — all without any frontend framework.

---

## Features

- **Dark / Light Mode** — Smooth theme toggle with localStorage persistence
- **Working Contact Form** — Sends real emails via Nodemailer + Gmail SMTP
- **Auto Reply** — Visitor gets an instant confirmation email
- **Particle Animation** — 80 floating particles with connecting lines on canvas
- **Shooting Stars** — Periodic animated shooting stars across the hero section
- **Animated Orbs** — 4 independently floating gradient background orbs
- **Custom Cursor** — Smooth custom cursor with trailing animation
- **Fully Responsive** — Mobile-first design, works on all screen sizes
- **Scroll Animations** — Elements reveal on scroll with staggered delays
- **Counter Animation** — Animated number counters in the hero section
- **Blog Section** — 3 blog cards showcasing thoughts & learnings
- **Rate Limiting** — Max 5 form submissions per IP per 10 minutes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Email | Nodemailer + Gmail SMTP App Password |
| Fonts | Bebas Neue, Cabinet Grotesk, JetBrains Mono |
| Icons | Font Awesome 6.5 |
| Hosting | Render (recommended) |

---

## Project Structure

```
FUTURE_FS_01/
│
├── public/                 # Frontend (served as static files)
│   ├── index.html          # Main HTML — all sections
│   ├── style.css           # All styles + dark/light mode vars
│   └── script.js           # Animations, form, theme toggle
│
├── server.js               # Express backend + contact API
├── package.json            # Project metadata & dependencies
├── .env                    # Secret credentials (never commit!)
├── .env.example            # Template for .env setup
├── .gitignore              # Keeps .env & node_modules off GitHub
└── README.md               # You are here
```

---

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- A Gmail account with 2-Step Verification enabled

### 1. Clone the repository
```bash
git clone https://github.com/sumananand460/FUTURE_FS_01.git
cd FUTURE_FS_01
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in:
```
EMAIL_USER=sumananand470@gmail.com
EMAIL_PASS=your_16_char_app_password
PORT=3000
```

> **How to get an App Password:**
> Google Account → Security → 2-Step Verification → App Passwords → Generate

### 4. Run the server
```bash
npm run dev       # Development (auto-restarts on save)
npm start         # Production
```

### 5. Open in browser
```
http://localhost:3000
```

---

## How the Contact Form Works

1. Visitor submits name, email, subject, and message
2. Server validates all fields and checks rate limit (max 5 per IP per 10 min)
3. **Notification email** is delivered to `sumananand470@gmail.com`
4. **Auto-reply** is sent back to the visitor instantly
5. Form shows a success or error message in real time

---

## Sections

| # | Section | Description |
|---|---|---|
| 01 | Hero | Animated title, eyebrow badge, stat counters, CTA buttons |
| 02 | About | Bio, B.Tech & school education cards |
| 03 | Skills | 12 skill cards with icons across a 4-column grid |
| 04 | Projects | TO-DO App, Quiz Game, Portfolio Website |
| 05 | Blog | 3 articles on JavaScript, React, and career learnings |
| 06 | Contact | Working email form + direct links |

---

## Deploy to Render (Free)

1. Push your code to GitHub *(make sure `.env` is in `.gitignore`)*
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables in the Render dashboard:
   - `EMAIL_USER` → `sumananand470@gmail.com`
   - `EMAIL_PASS` → your App Password
6. Click **Deploy**

---

## Security

- `.env` credentials never exposed to the frontend
- HTML injection prevention via `escapeHtml()` on all user inputs
- Rate limiting: max 5 form submissions per IP per 10 minutes
- Input validation with length limits on all fields
- `node_modules/` and `.env` excluded from Git via `.gitignore`

---

## License

This project is licensed under the **MIT License**.

---

*Made with passion by **Suman Anand**
