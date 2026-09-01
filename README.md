# Zhillan Qisa Zhahiran — Portfolio

Static portfolio site. No build step, no dependencies, no framework.
Open `index.html` in any browser to view it.

Built from the design canvas export in `design/`. That `.dc.html` is
**not** a runnable website: it needs React plus the `support.js` runtime, its
own runtime hides the markup, and its interactive parts are written as
`<sc-for>` / `<sc-if>` templates driven by a `DCLogic` component. `index.html`
plus `app.js` is the standalone equivalent.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The page. Six sections plus the lightbox markup. |
| `styles.css` | All styling, tokenized in `:root`. |
| `app.js` | Map gallery data, filter tabs, lightbox, scroll reveal. |
| `assets/maps/` | 46 maps in five groups: wb, skl, infra, ts, base. |
| `assets/studio/` | Three posters and the 64-page final report PDF. |
| `assets/workshop/` | Cohort banner and five field photographs. |
| `assets/portrait.jpg` | Hero portrait. |
| `assets/og-preview.png` | 1200x630 social preview. |
| `design/` | Original canvas source, for reference only. |

## Images were recompressed

The raw export is 214 MB of images, far too heavy to deploy or to load on a
phone. Everything in `assets/` was downscaled to an 1800-2000 px long edge and
re-encoded, taking it to 19.9 MB (91 percent smaller) with no visible loss at
the sizes the page actually displays.

Your originals are untouched in `Professional website setup/`, which is
gitignored and never published. To swap an image, drop an already-sized file
straight into `assets/`.

## How the map gallery works

`app.js` holds the map list as data. Each entry is a group key, a label, a
subtitle and a path. The five tabs filter that list; clicking a card opens the
lightbox, which supports Escape to close and the arrow keys to step through the
current group, wrapping at both ends.

To add a map: drop the file into the right `assets/maps/<group>/` folder and add
one line to the matching array in `app.js`. Nothing else needs to change.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/zhillanqisa/portofolio.git
git push -u origin main
```

Then on GitHub: **Settings > Pages > Build and deployment > Deploy from a
branch**, pick `main` and `/ (root)`, and save. The site appears at
`https://zhillanqisa.github.io/portofolio/` within a minute or two.

`.nojekyll` is already present so GitHub serves the files as-is.

### One thing to edit after deploying

If you use a repository name other than `portofolio`, or a custom domain, update
the four absolute URLs in the `<head>` of `index.html`: `canonical`, `og:url`,
`og:image` and `twitter:image`. Everything else uses relative paths.

Social previews on LinkedIn and WhatsApp only work once the site is live on a
real URL; they cannot read a local file.

## Notes

- `assets/CV_Zhillan_Qisa_Zhahiran.pdf` is still in the repo but the current
  design does not link to it. Say the word and it can go back in the hero.
- The page pulls two things from the network: Google Fonts, and the YouTube
  thumbnail for the documentary. Everything else is local.
