# Zhillan Qisa Zhahiran — Portfolio

Static portfolio site. No build step, no dependencies, no framework.
Open `index.html` in any browser to view it.

Built from the design canvas export in `design/`. Those `.dc.html` files are
**not** runnable websites: they need React plus the `support.js` runtime, their
own runtime hides the markup, and the interactive parts are written as
`<sc-for>` / `<sc-if>` templates driven by a `DCLogic` component. `index.html`,
`experience.html`, `styles.css` and `app.js` are the standalone equivalent.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home. Eight sections plus the lightbox. |
| `experience.html` | Experience detail page, linked from the nav. |
| `styles.css` | All styling, tokenized in `:root`, plus the dark theme. |
| `app.js` | Theme toggle, hero parallax, skills marquee, map gallery, lightbox, scroll reveal. |
| `assets/maps/` | 46 maps in five groups: wb, skl, infra, ts, base. |
| `assets/icons/` | 17 brand icons, used as CSS masks so they take any colour. |
| `assets/life/` | Four personal photographs for the Outside the maps section. |
| `assets/studio/` | Three posters and the 64-page final report PDF. |
| `assets/workshop/` | Cohort banner and five field photographs. |
| `assets/Zhillan Qisa Zhahiran - CV.pdf` | Resume, linked from the About section. |
| `design/` | Original canvas sources, for reference only. |

## What the JavaScript does

- **Theme toggle.** Stores the choice in `localStorage` under `zqz-theme` and
  toggles `zq-dark` on the root element. Dark mode works by inverting whole
  scopes and re-inverting images, so there is only one set of colour tokens.
- **Hero parallax.** The hero is sticky and the page scrolls over it; the hero
  fades, lifts, scales and blurs as you scroll. Disabled under
  `prefers-reduced-motion`.
- **Skills.** Three marquee rows of tool chips, paused on hover, with a hover
  hint line. The toggle switches to a grouped grid of all 24 tools.
- **Map gallery.** Five tabs filter 46 maps. Clicking a card opens the lightbox,
  which supports Escape to close and arrow keys to step through the current
  group, wrapping at both ends.

## Images were recompressed

The raw export is far too heavy to deploy: the maps alone were 214 MB and the
four life photographs another 23.5 MB. Everything in `assets/` was downscaled
and re-encoded, bringing the site to about 30 MB with no visible loss at the
sizes the page actually displays.

Your originals are untouched in `Professional website setup/`, which is
gitignored and never published.

## Deploying to GitHub Pages

Already on GitHub at `zhillanqisa/Portofolio`. To publish:

**Settings > Pages > Build and deployment > Deploy from a branch**, choose
`main` and `/ (root)`, then save. The site appears at
`https://zhillanqisa.github.io/Portofolio/` after a minute or two.

`.nojekyll` is present so GitHub serves the files as-is.

If you rename the repository or add a custom domain, update the absolute URLs
in the `<head>` of `index.html` and `experience.html`: `canonical`, `og:url`,
`og:image` and `twitter:image`. Everything else uses relative paths.

## Known gaps

- The design has empty logo placeholders next to the Education entry and the
  Summer Workshop credit, meant for the UNDIP and UH Manoa marks. No logo files
  were supplied, so those slots are left out rather than shipped as empty grey
  boxes. Drop the files in and they can be added.
- The page pulls two things from the network: Google Fonts, and the YouTube
  thumbnail for the documentary. Everything else is local.
