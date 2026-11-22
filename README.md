Warning: fs was declared with const; use let for reassignable variables.
# LearnMate AI

LearnMate AI is a responsive front-end prototype for a more curious, collaborative way to learn. It brings study discussions, thinking-skill practice, imaginative brainstorming, and a learning-buddy demo together in one editorial-style experience.

## Features

- Responsive navigation for Explore, Communities, Skill Studio, Idea Lab, and the learning-buddy demo.
- Full-bleed illustrated artwork with pointer-responsive parallax, subtle ambient motion, and scroll movement.
- Reduced-motion support for visitors who prefer less animation.
- Filterable study circles with local join/leave controls.
- Skill Studio with selectable exercises and an interactive practice-progress indicator.
- Idea Lab with Flip, Combine, and Scale brainstorming lenses and a local thought wall.
- Learning-buddy chat preview with sample front-end responses.

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

Community joins, skill progress, saved ideas, and chat replies are browser-side demonstrations. They do not connect to an account, community service, database, or live AI model, and they are not persisted between visits. Google Fonts load from the web when available; system font fallbacks are provided.
