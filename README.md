# evanjetlee.com

Personal site for Evan David Lee, Jetspeed Social. Vite + Three.js + GSAP ScrollTrigger + Lenis.

## Edit the words
All copy lives in `src/content.js`. Case studies marked `placeholder: true` show a yellow
PLACEHOLDER tag until real numbers from the deck replace them. Set `dmLink` to Evan's real DM link.

## The 3D figure
`public/img/evan-cutout.webp` (photo with background removed) is pushed into relief by
`public/img/evan-depth.png` in `src/scene.js`. To swap in a true 3D scan, export a `.glb`
(from an image-to-3D tool or a phone scan) to `public/models/evan.glb`. The site detects it and uses it instead.

## Run locally
```
npm install
npm run dev
```

## Deploy
Import this repo in Vercel. It auto-detects Vite (build `npm run build`, output `dist`). Every push to the branch deploys.
