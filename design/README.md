# design/

`icon-source.svg` is the 512×512 source for the PWA/app icons in
`public/icons/`. It's kept out of `public/` so it isn't shipped as a static
asset — it's a build-time source, not something the app serves.

To regenerate the PNGs after editing it (there's no persistent image
dependency in `package.json` for this — install `sharp` temporarily):

```bash
npm install -D sharp
node -e "
const sharp = require('sharp');
const svg = require('fs').readFileSync('design/icon-source.svg');
const targets = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['maskable-512.png', 512],
  ['apple-touch-icon.png', 180],
];
Promise.all(targets.map(([file, size]) =>
  sharp(svg, { density: 384 }).resize(size, size).png().toFile('public/icons/' + file)
));
"
npm uninstall sharp
```

Keep flower content within the inner ~80% of the canvas (the maskable safe
zone) — Android/other OSes crop icon corners to their own mask shapes.
