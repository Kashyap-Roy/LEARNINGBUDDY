# LearnMate — Learn Together, Think Further

**LearnMate** is an interactive, front-end web application designed as a collaborative study buddy and curiosity platform. It brings curious minds together to explore complex topics, practice mental disciplines, brainstorm ideas, and engage in conversational learning.

---

## ✨ Key Features

### 1. Cinematic Home Experience (`#home`)
* **Scroll-Snap Storytelling:** A three-slide vertical storytelling showcase with smooth CSS/JS transitions, directional parallax, and ambient floating dust particles.
* **Pointer Depth & Sway:** Subtle mouse-tracking depth effects on imagery and typography (automatically disabled if `prefers-reduced-motion` is enabled).

### 2. Explore & Rabbit Holes (`#explore`)
* **Featured Inquiries:** Quick-launch cards for big questions in science, nature, and collective thinking.
* **Interactive Rabbit Hole Grid:** A paginated $5 \times 6$ grid featuring 30 curated, mind-expanding topics (e.g., *Event Horizons, Quantum Entanglement, Fermi Paradox, Turing Patterns*) plus 30 reserved portal frames on Page 2.
* **Direct-to-Buddy Integration:** Clicking any card or portal automatically navigates to the Buddy chat interface and pre-fills the inquiry.

### 3. Communities (`#communities`)
* **Topic Filtering:** Filter discussion circles by **All**, **Science**, **Creative**, or **Study**.
* **Interactive Joining:** Toggle membership status on active community threads.

### 4. Skill Studio (`#skills`)
* **Deliberate Practice Modes:** Switch between four core mental disciplines:
  * **Focus:** Stay with one good question.
  * **Explain:** Make a hard idea feel simple without jargon.
  * **Invent:** Give ordinary objects new jobs.
  * **Listen:** Understand and restate opposing views fairly.
* **Repetition Tracker:** Log completed practice reps with a dynamic progress bar and daily rep counter.

### 5. Idea Lab (`#ideas`)
* **Creative Lenses:** Enter any seed thought and transform it using three cognitive lenses: **Flip it**, **Combine it**, or **Scale it**.
* **Idea Wall:** Pin generated prompts to a visual wall for ongoing brainstorming.

### 6. Study Buddy Preview (`#buddy`)
* **Interactive Chat Interface:** A front-end conversational preview where users can ask "why" questions or launch prompts directly from the Explore section.

### 7. Adaptive Authentication Overlay (`#authOverlay`)
* **Seamless Visual Morph:** Transitions the active home slide into a black-and-white split-screen layout when opening Sign In or Sign Up.
* **Age-Adaptive Themes:** Automatically adjusts the UI theme based on user age (`kids` for under 10, `teen` for 10–19, and `adult` for 20+), including guardian email verification for users under 13.
* **Google Sign-In & Preview Mode:** Integrates with Google Identity Services (`gsi/client`) and includes a built-in demo modal with sample profiles when unconfigured.

### 8. Accessibility & Theme Support
* **Dark & Light Modes:** Built-in theme switcher (`theme.js` + CSS custom properties).
* **Responsive & Accessible:** Mobile-friendly bottom navigation bar, keyboard navigation support, ARIA attributes, and `prefers-reduced-motion` compliance.

---

## 📁 Expected Project Structure

Based on the dependencies referenced in `index.html`, the project expects the following directory layout:

```text
learnmate/
├── index.html               # Main single-page application shell, styles, and UI logic
├── README.md                # Project documentation
├── manifest.json            # Web app manifest
├── favicon.ico              # Root favicon
├── theme.js                 # Light/dark mode initialization script
├── config.js                # Configuration file (e.g., Google OAuth Client ID)
├── auth.js                  # Authentication state, age-group routing, and session management
├── auth.html                # Fallback standalone authentication page
├── app.html                 # Authenticated main application destination
└── assets/
    ├── logo.png
    ├── logo-mark.png
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── hero-wide.webp
    ├── astronaut-generated.webp
    ├── collective-thinking.webp
    ├── mind-garden.webp
    ├── curiosity-poster.webp
    ├── buddy-mars.webp
    ├── explore-backdrop.jpg
    └── skills-backdrop.jpg
```

---

## 🚀 Getting Started

1. **Clone or Download:** Place all project files and the `assets/` directory in your web root.
2. **Configure Google Auth (Optional):** Open `config.js` and add your Google OAuth Client ID. If left unconfigured, clicking **Continue with Google** will launch the built-in **Preview Mode** modal with sample accounts.
3. **Run Locally:** Serve the directory using any static web server (e.g., VS Code Live Server, `npx serve`, or `python -m http.server`):
   ```bash
   npx serve .
   ```
4. **Open in Browser:** Navigate to `http://localhost:3000` (or the port provided by your server).

---

## 🛠️ Tech Stack

* **HTML5 & Semantic Markup:** Single-page view switching using `<section class="win">` and URL hash routing (`#home`, `#explore`, `#communities`, `#skills`, `#ideas`, `#buddy`).
* **Modern CSS3:** Custom properties (`--teal`, `--coral`, `--cream`), CSS Grid/Flexbox, `backdrop-filter` glassmorphism, keyframe animations, and responsive media queries.
* **Vanilla JavaScript (ES6+):** Zero-framework DOM manipulation, Web Animations API (`element.animate`) for auth transitions, `requestAnimationFrame` pointer-tracking loops, and `localStorage` session checks.
* **Typography:** Google Fonts (*Bricolage Grotesque*, *Geist*, *Fredoka*, and *Nunito*).