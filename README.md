# LearnMate AI

LearnMate AI is a responsive front-end prototype for a more curious, collaborative way to learn. It brings study discussions, thinking-skill practice, imaginative brainstorming, and a learning-buddy demo together in one editorial-style experience.

## Live demo

Explore the deployed prototype: [learnmate-ai-w44n.onrender.com](https://learnmate-ai-w44n.onrender.com/).

## Features

- Responsive navigation for Explore, Communities, Skill Studio, Idea Lab, and the learning-buddy demo.
- Full-bleed illustrated artwork with pointer-responsive parallax, subtle ambient motion, and scroll movement.
- Reduced-motion support for visitors who prefer less animation.
- Filterable study circles with local join/leave controls.
- Skill Studio with selectable exercises and an interactive practice-progress indicator.
- Idea Lab with Flip, Combine, and Scale brainstorming lenses and a local thought wall.
- Learning-buddy chat preview with sample front-end responses.

## Accounts and age-based looks

- `auth.html` handles sign in and sign up. Sign-up asks for age; under-13s also get a parent/guardian email field.
- The look follows age: **under 10** colourful and playful, **10 to 19** soft and aesthetic, **20+** monochrome and minimal. `themes.css` holds all three; `app.html` is the signed-in experience.
- `auth.js` is the whole account layer (accounts live in the browser's localStorage until a backend exists). Swap its functions for API calls later; the pages only use `window.Auth`.
- **Google sign-in:** put your OAuth Web Client ID in `config.js`. Age is read from the Google account's birthday (People API, `user.birthday.read` scope). If Google has no full birthday on file, the user is asked for their age. With no Client ID set, the Google button opens a preview chooser with sample accounts.
- Admin preview: on the sign-in page, enter `thrivetribeadmin1117` as the email and the current time (24-hour `HH:MM`) as the password, then pick any look. Admins also get a look switcher in the app. This check runs in the browser, so move it server-side before launch.

## Run locally

No package installation or build step is required. Open `index.html` in a browser, or serve the folder locally:

```sh
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy to Render

This repository includes a Render Blueprint in [`render.yaml`](render.yaml). It publishes the repository root as a static site, so no package installation or build step is needed.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/hironbiswas57-droid/LEARNINGBUDDY)

To deploy manually, create a **Static Site** in Render and connect this repository with these settings:

- **Branch:** `main`
- **Build command:** `echo 'No build step required'`
- **Publish directory:** `.`

Render will provide a public `onrender.com` URL after the first deploy. Pushes to `main` trigger updates when automatic deploys are enabled.

## Project files

```text
LEARNINGBUDDY/
├── index.html
├── README.md
├── render.yaml
└── assets/
    ├── hero-wide.webp
    ├── astronaut-generated.webp
    ├── citrus-generated.webp
    ├── collective-thinking.webp
    ├── mind-garden.webp
    ├── curiosity-poster.webp
    └── supporting source and fallback artwork
```

## Prototype notes

Community joins, skill progress, saved ideas, and chat replies are browser-side demonstrations. Accounts are browser-only for now. They do not connect to a community service, database, or live AI model, and they are not persisted between visits. Google Fonts load from the web when available; system font fallbacks are provided.
