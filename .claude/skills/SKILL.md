---
name: impeccable
description: Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens. Also use for bland designs that need to become bolder or more delightful, loud designs that should become quieter, live browser iteration on UI elements, or ambitious visual effects that should feel technically extraordinary. Not for backend-only or non-UI tasks.
version: 3.5.0
user-invocable: true
argument-hint: "[craft|shape · audit|critique · animate|bolder|colorize|delight|layout|overdrive|quieter|typeset · adapt|clarify|distill · harden|onboard|optimize|polish · init|document|extract|live] [target]"
license: Apache 2.0
allowed-tools:
  - Bash(npx impeccable *)
---

Designs and iterates production-grade frontend interfaces. Real working code, committed design choices, exceptional craft.

## Setup

You MUST do these steps before proceeding:

1. Run `node .claude/skills/impeccable/scripts/context.mjs` once per session. If you've already seen its output in this conversation, do not re-run it. The script either prints the project's PRODUCT.md (and DESIGN.md when present) as a markdown block, or tells you it's missing. Follow whatever it prints. **If it reports `NO_PRODUCT_MD`, stop and follow `reference/init.md` before doing anything else.** If the output ends with an `UPDATE_AVAILABLE` directive, follow it (ask the user once about updating, then continue). It never blocks the current task.
2. If the user invoked a sub-command (`craft`, `shape`, `audit`, `polish`, ...), you MUST read `reference/<command>.md` next. Non-optional. The reference defines the command's flow; without it you will skip steps the user expects.
3. Familiarize yourself with any existing design system, conventions, and components in the code. Read at least one project file (CSS / tokens / theme / a representative component or page). **Required even when you've loaded a sub-command reference in step 2.** Don't reinvent the wheel; use what's there when it works, branch out when the UX wins.
4. Read the matching register reference. **This is non-optional; skipping it produces generic output.** If the project is marketing, a landing page, a campaign, long-form content, or a portfolio (design IS the product), read `reference/brand.md`. If it is app UI, admin, a dashboard, or a tool (design SERVES the product), read `reference/product.md`. Pick by first match: (1) task cue ("landing page" vs "dashboard"); (2) surface in focus (the page, file, or route being worked on); (3) `register` field in PRODUCT.md.
5. **If the project is brand-new (no existing CSS tokens / theme / committed brand colors found in step 3)**, run `node .claude/skills/impeccable/scripts/palette.mjs` to receive a brand seed color and composition guidance. This is the anchor for your primary brand color. Compose the rest of the palette (bg, surface, ink, accent, muted) around it per the script's instructions. Use OKLCH throughout. **Skip this step only if step 3 found committed brand colors in existing tokens; in that case identity-preservation wins.**

## Design guidance

Produce ready-to-ship, production-grade code, not prototypes or starting points. Take no shortcuts unless the user asks for them (when in doubt, ask). Don't stop until arriving at a complete implementation (beautiful, responsive, fast, precise, bug-free, on brand). You take attention to detail seriously: every page, section or component crafted is battle tested using the tools available to you (browser screenshotting, computer use, etc). Claude is capable of extraordinary work. Don't hold back.

### General rules

#### Color

- **Verify contrast.** Body text must hit ≥4.5:1 against its background; large text (≥18px or bold ≥14px) needs ≥3:1. Placeholder text needs the same 4.5:1, not the muted-gray default. The most common failure: muted gray body text on a tinted near-white. If the contrast is even close, bump the body color toward the ink end of the ramp; light gray "for elegance" is the single biggest reason AI designs feel hard to read.
- Gray text on a colored background looks washed out. Use a darker shade of the background's own hue, or a transparency of the text color.

#### Dark mode

- Default to system preference (`@media (prefers-color-scheme: dark)`) combined with a JS toggle via `[data-theme="dark"]` on `:root`. The class approach lets users override their system setting without losing the fallback.
- Set `color-scheme: light` or `color-scheme: dark` on `:root`. This one property fixes native control rendering (scrollbars, `<input>`, `<select>`, date pickers) at no cost. Missing it leaves form elements visually stranded.
- Shadows change character in dark mode — dark drop shadows vanish against dark surfaces. Use low-opacity white glows (`box-shadow: 0 0 0 1px oklch(1 0 0 / 0.07)`) or differentiate elevation through surface lightness alone.
- Don't invert images for dark mode (`filter: invert(1)`). Use `<picture>` with a `<source media="(prefers-color-scheme: dark)">` alternate, or a CSS custom property that swaps the `content` value.
- Dark palettes are not inverted light palettes. Surfaces use low-chroma, low-lightness OKLCH values. Accent colors often need a slight hue shift to maintain perceived vibrancy at lower lightness — test in both modes before committing.

#### Typography

- Cap body line length at 65–75ch.
- Hierarchy through scale + weight contrast (≥1.25 ratio between steps). Avoid flat scales.
- Cap font-family count at 3 (display + body + optional mono). More than 3 reads as indecision, not richness. One well-tuned family with weight contrast usually beats three competing typefaces.
- Don't pair fonts that are similar but not identical (two geometric sans-serifs, two humanist sans-serifs). Pair on a contrast axis (serif + sans, geometric + humanist) or use one family in multiple weights.
- No all-caps body copy. Sentences in ALL CAPS are unreadable at body sizes.
- Hero / display heading ceiling: clamp() max ≤ 6rem (~96px). Above that the page is shouting, not designing.
- Display heading letter-spacing floor: ≥ -0.04em. Anything tighter and letters touch; cramped, not "designed".
- Use `text-wrap: balance` on h1–h3 for even line lengths; `text-wrap: pretty` on long prose to reduce orphans.
- `font-display: swap` for body fonts (text visible immediately, reflows on load); `font-display: optional` for decorative display fonts where layout shift is worse than FOUT. `<link rel="preload" as="font" crossorigin>` only on the 1–2 fonts critical to first paint — preloading every weight file defeats the purpose.
- Variable fonts over multiple weight files when the family offers one. One network request, full weight range, better compression.
- Minimize fallback layout shift: `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` in the fallback `@font-face` can match a system font within 2% of the web font's metrics — worth doing for fonts that affect the hero.

#### Layout

- Vary spacing for rhythm.
- Cards are the lazy answer. Use them only when they're truly the best affordance. Nested cards are always wrong.
- Flexbox for 1D, Grid for 2D. Don't default to Grid when `flex-wrap` would be simpler.
- For responsive grids without breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`.
- Build a semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip). Never arbitrary values like 999 or 9999.

#### Motion
- Motion should be intentional, and not be an afterthought. consider it as part of the build.
- Don't animate CSS layout properties unless truly needed.
- Ease out with exponential curves (ease-out-quart / quint / expo). No bounce, no elastic.
- Use libraries for more advanced motion needs (e.g. motion, gsap, anime.js, lenis etc)
- Reduced motion is not optional. Every animation needs a `@media (prefers-reduced-motion: reduce)` alternative: typically a crossfade or instant transition.
- Staggering the items within one list is legitimate. The tell is the uniform reflex (one identical entrance applied to every section), not motion itself; each reveal should fit what it reveals. Suppressing the reflex is never a reason to ship a page with no motion at all.
- Reveal animations must enhance an already-visible default. Don't gate content visibility on a class-triggered transition; transitions pause on hidden tabs and headless renderers, so the reveal never fires and the section ships blank.
- Premium motion materials are not just transform/opacity. Blur, backdrop-filter, clip-path, mask, and shadow/glow are part of the palette when they materially improve the effect and stay smooth.

#### GSAP & ScrollTrigger

GSAP earns its place for timeline-driven, orchestrated motion that CSS transitions can't produce. The AI tell is uniform treatment: every element gets `y: 50, opacity: 0, duration: 0.8, stagger: 0.2`. The result scrolls like a PowerPoint deck.

**Orchestration**
- One `ScrollTrigger` per section, not per element. Build a GSAP timeline for the section, attach one trigger to it, and sequence all elements inside it. Independent triggers on every element break coordination and produce unrelated reveals with no sense of authorship.
- Vary duration by visual weight. Hero headings and full-width images: 0.9–1.4s. Tags, captions, small icons: 0.3–0.5s. Uniform duration across all elements is the AI reflex — it makes everything feel like it was styled with one find-and-replace.
- Stagger by total amount, not fixed interval. `stagger: { amount: 0.4 }` distributes the budget across however many items exist. Fixed `stagger: 0.2` on 8 items means the last item starts 1.6s after the first — most users have already scrolled past.
- `scrub: 1` (momentum lag), never `scrub: true` (instant). For pinned storytelling sections: `scrub: 1.5–2`.
- Ease by role: headings → `power4.out`; body/cards → `power2.out`; decorative elements → `expo.out`; number counters → `none` then snap. Never `elastic` or `bounce` outside a playful/toy register.

**Reveals**
- Fade + rise (`y: 40, opacity: 0`) is the dead default. Use it only when the content has no better spatial story. Prefer: `clipPath` wipe (`inset(100% 0% 0% 0%) → inset(0% 0% 0% 0%)`), scale from anchor (`scale: 0.94, transformOrigin: "bottom center"`), blur dissolve (`filter: "blur(10px)" → "blur(0px)"`), or horizontal slide for content that reads left-to-right.
- Split text on h1–h2 only (never body text). Animate `y` and `opacity` per character, `stagger: 0.025`, `duration: 0.55`, `ease: "power4.out"`. Wrap each line in `overflow: hidden` so characters emerge from below rather than drifting in from space.
- Image reveals: scale `1.08 → 1` while fading in (`transformOrigin: "center center"`). The settling motion gives weight — the image "lands" rather than appearing.
- Parallax on images: `yPercent: -15` with `scrub: 1` on the image inside a clipped container creates depth without jank. Apply to hero backgrounds and large editorial images only — parallax on every section image is noise.

**Pinned sections**
- The most human-feeling pattern because it requires deliberate authorship. Use for: feature capability reveals, product walkthroughs, before/after comparisons, data storytelling.
- Structure: `pin: true` on the section, `scrub: 1.5`, multiple labeled steps in the timeline.
- Each step must produce a clear, distinct visual change — pinning a section and barely moving anything is worse than no pin.
- Cap at 300–400vh. Longer pins feel like punishment; the user loses sense of progress.

**What not to do**
- Don't ScrollTrigger the hero. It's visible on page load; the trigger fires only on scroll, which most users never do before reading the hero. Use a load timeline (`gsap.timeline({ delay: 0.15 })`) for hero content instead.
- Don't animate layout properties (`width`, `height`, `padding`, `margin`). Use `transform` and `clip-path` — no layout recalculation per frame.
- Don't reach for GSAP for hover states, color transitions, or button feedback. CSS handles these faster with no JS and respects `prefers-reduced-motion` with one media query. GSAP for hover is overengineering.
- `will-change: transform` only on elements currently animating; remove it after the animation completes via `onComplete`. Global application is a memory leak that hurts GPU compositing.
- Reduced motion: wrap all GSAP initialization in `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)`. Don't swap for "subtle" alternatives — skip the animation entirely when the user has opted out.

#### Interaction

- Dropdowns rendered with `position: absolute` inside an `overflow: hidden` or `overflow: auto` container will be clipped. Use the native `<dialog>` / popover API, `position: fixed`, or a portal to escape the stacking context.
- **Touch targets**: minimum 44×44px for any tappable element. Use padding to hit the target size when the visual should stay small — don't enlarge the element itself.
- **Hover states**: every interactive element needs a visible change at hover beyond `cursor: pointer`. Minimum: color or opacity shift. Preferred: a `transform` or background change that signals affordance. `:hover` misfires on touch; always pair with a `:active` state for tactile feedback on mobile.
- **Disabled states**: `opacity: 0.4` alone is not a disabled state — it's an unexplained wall. Pair with a tooltip or inline explanation whenever the reason isn't already visible on screen. Use `aria-disabled="true"` (allows focus for explanation) over the HTML `disabled` attribute when the user needs to understand why before proceeding.
- **`scroll-behavior: smooth` globally is wrong.** It makes programmatic scrolls (anchor jumps, `scrollIntoView`, router navigation) feel sluggish and fights with scroll-based animation libraries. Apply it scoped to anchor links only, or call `scrollIntoView({ behavior: 'smooth' })` at the call site.
- **Focus management in modals**: when a dialog opens, focus moves to the first interactive element inside. When it closes, focus returns to the trigger element. Without this, keyboard and screen-reader users lose their place in the document.

#### States

Every UI surface ships in at least four states: default, loading, empty, error. Shipping a component without all four is shipping an incomplete component.

- **Loading / skeleton**: match skeleton shape to real content layout — same grid, same card proportions. A gray rectangle where text will appear is a broken promise about layout. Use a shimmer animation (moving gradient) rather than a static fill. Cap skeletons at 1.5s; if data takes longer, switch to a progress indicator with context ("Loading 1,200 records...").
- **Empty states**: empty ≠ blank. An empty list needs three things: what it is, why it's empty, and one clear action to fill it. The visual weight should be lighter than the loaded state. An illustration or icon earns its place here — it's one of the few surfaces where decorative art is also functional.
- **Error states**: distinguish user error (fixable — show exactly what to change) from system error (not their fault — apologize, give retry, log it silently). Error text belongs next to the field or element that caused it, not at the top of the form. Never expose raw error codes, stack traces, or internal identifiers in UI copy.
- **Disabled**: pair visual dimming with a reason whenever the trigger isn't already obvious on screen. If an action is blocked, show what unblocks it — a progress step, a missing field, a required permission.

#### Accessibility

- **`:focus-visible`**: style it, never suppress it without a replacement. `outline: 2px solid var(--color-accent); outline-offset: 3px` is the minimum. Remove the browser default only when you've provided a custom ring: `:focus:not(:focus-visible) { outline: none }` strips it for mouse clicks while preserving it for keyboard navigation.
- **Semantic HTML before ARIA.** `<button>` for actions, `<a href>` for navigation — never `<div onClick>`. `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>` are landmarks; use them for the right regions. `<section>` requires a heading to be meaningful; `<div>` is for styling only. `role="button"` on a `<div>` is a symptom of wrong element choice, not a solution.
- **Skip link**: first element in `<body>`, visible on focus, targets `#main-content`. Required on any page with a navigation header. Without it, keyboard users tab through the entire nav on every page.
- **Icon-only buttons require `aria-label`** — no exceptions. The label describes the action ("Close dialog"), not the icon ("X").
- **`alt` text**: describe what the image communicates, not what it depicts. "Bar chart showing 40% Q3 revenue growth" beats "chart". Decorative images: `alt=""`.

### Copy

- Every word earns its place. No restated headings, no intros that repeat the title.
- **No em dashes.** Use commas, colons, semicolons, periods, or parentheses. Also not `--`.
- **No aphoristic-cadence body copy as a default voice.** If multiple section copy blocks share a single repeating sentence rhythm, especially a contrarian-sounding closer, rewrite. Specific, not aphoristic.
- **No marketing buzzwords.** The streamline / empower / supercharge / leverage / unleash / transform / seamless / world-class / enterprise-grade / next-generation / cutting-edge / game-changer / mission-critical family of phrases. Pick a specific noun and a verb that describes what the product literally does.
- Button labels: verb + object. "Save changes" beats "OK"; "Delete project" beats "Yes". The label should say what will happen.
- Link text needs standalone meaning. "View pricing plans" beats "Click here"; screen readers announce links out of context.

### New projects only (when no prior work exists)

#### Color & Theme

- Use OKLCH.
- **The cream / sand / beige body bg is the saturated AI default of 2026.** The whole warm-neutral band (OKLCH L 0.84-0.97, C < 0.06, hue 40-100) reads as cream/sand/paper/parchment regardless of what you call it. Token names like `--paper`, `--cream`, `--sand`, `--bone`, `--flour`, `--linen`, `--parchment`, `--wheat`, `--biscuit`, `--ivory` are tells in themselves. If the brief is "warm, traditional, family-coastal-Italian" or "magazine-warm" or "editorial-restraint", DO NOT translate that into a near-white warm-tinted bg; that's the AI move. Pick: (a) a saturated brand color as the body (terracotta, oxblood, deep ochre, near-black), (b) a true off-white at chroma 0 (or chroma toward the brand's own hue, not toward warmth-by-default), or (c) a darker mid-tone tinted neutral that's clearly the brand's own. "Warmth" in the brand is carried by accent + typography + imagery, not by body bg.
- Tinted neutrals: add 0.005–0.015 chroma toward the brand's hue. Don't default-tint toward warm or cool "because the brand feels that way"; that's the cross-project monoculture move.
- When picking a theme: Dark vs. light is never a default. Not dark "because tools look cool dark." Not light "to be safe.".Before choosing, write one sentence of physical scene: who uses this, where, under what ambient light, in what mood. If the sentence doesn't force the answer, it's not concrete enough. Add detail until it does.
- Pick a **color strategy** before picking colors. Four steps on the commitment axis:
  - **Restrained**: tinted neutrals + one accent ≤10%. Product default; brand minimalism.
  - **Committed**: one saturated color carries 30–60% of the surface. Brand default for identity-driven pages.
  - **Full palette**: 3–4 named roles, each used deliberately. Brand campaigns; product data viz.
  - **Drenched**: the surface IS the color. Brand heroes, campaign pages.

### Absolute bans

Match-and-refuse. If you're about to write any of these, rewrite the element with different structure.

- **Side-stripe borders.** `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts. Never intentional. Rewrite with full borders, background tints, leading numbers/icons, or nothing.
- **Gradient text.** `background-clip: text` combined with a gradient background. Decorative, never meaningful. Use a single solid color. Emphasis via weight or size.
- **Glassmorphism as default.** Blurs and glass cards used decoratively. Rare and purposeful, or nothing.
- **The hero-metric template.** Big number, small label, supporting stats, gradient accent. SaaS cliché.
- **Identical card grids.** Same-sized cards with icon + heading + text, repeated endlessly.
- **Tiny uppercase tracked eyebrow above every section.** The 2023-era kicker (small all-caps text with wide tracking, "ABOUT" "PROCESS" "PRICING" above each heading) is now the saturated AI scaffold; it appears on 55-95% of generations regardless of brief, which is the definition of a tell. One named kicker as a deliberate brand system is voice; an eyebrow on every section is AI grammar. Choose a different cadence.
- **Numbered section markers as default scaffolding (01 / 02 / 03).** Putting `01 · About / 02 · Process / 03 · Pricing` above every section is the eyebrow trope one tier deeper: reach for it because "landing pages do this" and you're scaffolding by reflex. Numbers earn their place when the section actually IS a sequence (a real 3-step process, an ordered flow, a typed timeline) and the order carries information the reader needs. One deliberate numbered sequence on one page is voice; numbered eyebrows on every section across the site is AI grammar.
- **Text that overflows its container.** Long heading words plus large clamp scales plus narrow grids cause headline overflow on tablet/mobile. Test the heading copy at every breakpoint; if it overflows, reduce the clamp max or rewrite the copy. The viewport is part of the design.
- **Aurora / blob backgrounds.** Large blurred color orbs (`border-radius: 50%; filter: blur(80px+)`) used as atmospheric background decoration. The aurora look is the defining SaaS wallpaper of 2024–2026 — it appears on a majority of AI-generated landing pages regardless of brand or industry. Use directional gradients with clear intent, solid surfaces, or nothing.
- **Bento grid as default layout.** Mixed-size tiles in a mosaic with no hierarchy rationale. Only legitimate when size carries semantic weight (a featured item is larger because it matters more). Random tile sizing for "visual interest" is AI scaffolding with no design logic.
- **Hero + product mockup to the right.** Text left, device screenshot or UI preview right, full-width section, gradient or neutral background. The default skeleton of every SaaS landing page built since 2022. If your hero reads like a screenshot template, redesign the composition: full-bleed product image, editorial text-only, or an unconventional spatial relationship.
- **"Trusted by" logo strips without context.** A row of grayscale client or partner logos directly below the hero. Legitimate only when logos are named and the relationship is described. Pure logo rows as social proof decoration are noise, not signal.

### The AI slop test

If someone could look at this interface and say "AI made that" without doubt, it's failed. Cross-register failures are the absolute bans above. Register-specific failures live in each reference.

**Category-reflex check.** Run at two altitudes; the second one catches what the first one misses.

- **First-order:** if someone could guess the theme + palette from the category alone, it's the first training-data reflex. Rework the scene sentence and color strategy until the answer isn't obvious from the domain.
- **Second-order:** if someone could guess the aesthetic family from category-plus-anti-references ("AI workflow tool that's not SaaS-cream → editorial-typographic", "fintech that's not navy-and-gold → terminal-native dark mode"), it's the trap one tier deeper. The first reflex was avoided; the second wasn't. Rework until both answers are not obvious. The brand register's [reflex-reject aesthetic lanes](reference/brand.md) list catches the currently-saturated families.

## Commands

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Shape, then build a feature end-to-end | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | Build | Plan UX/UI before writing code | [reference/shape.md](reference/shape.md) |
| `init` | Build | Set up project context: PRODUCT.md, DESIGN.md, live config, next steps | [reference/init.md](reference/init.md) |
| `document` | Build | Generate DESIGN.md from existing project code | [reference/document.md](reference/document.md) |
| `extract [target]` | Build | Pull reusable tokens and components into design system | [reference/extract.md](reference/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](reference/critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, responsive) | [reference/audit.md](reference/audit.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](reference/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, edge cases | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [reference/layout.md](reference/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices and screen sizes | [reference/adapt.md](reference/adapt.md) |
| `optimize [target]` | Fix | Diagnose and fix UI performance | [reference/optimize.md](reference/optimize.md) |
| `live` | Iterate | Visual variant mode: pick elements in the browser, generate alternatives | [reference/live.md](reference/live.md) |

Plus two management commands: `pin <command>` and `unpin <command>`, detailed below.

### Routing rules

1. **No argument**: the user is asking "what should I do?" Make the menu context-aware instead of static. Setup has already run `context.mjs`; if that reported `NO_PRODUCT_MD` you are already in init (setup), so finish that and skip this. Otherwise run `node .claude/skills/impeccable/scripts/context-signals.mjs` once and read its JSON, then lead with the **2-3 highest-value next commands**, each with a one-line reason pulled from the signals, followed by the full menu (the table above, grouped by category). **Never auto-run a command; the recommendation is a suggestion the user confirms.**

   Reason over the signals; there is no score to obey:
   - `setup.hasDesign` false while `setup.hasCode` true → `document` (capture the visual system).
   - `critique.latest` is `null` → the project has never been critiqued; for a set-up project with a real surface, offering `/impeccable critique <surface>` is a strong default.
   - `critique.latest` with a low `score` or non-zero `p0` / `p1` → `polish` (it reads that snapshot as its backlog), or re-run `critique` if the snapshot looks stale.
   - `git.changedFiles` pointing at one surface → scope `audit` or `polish` to those files specifically, naming them.
   - `devServer.running` true → `live` is available for in-browser iteration; if false, don't lead with `live`.
   - Otherwise group by intent exactly as init's "Recommend starting points" step does (build new / improve what's there / iterate visually), tailored to `setup.register`.

   **If `scan.targets` is non-empty, run `node .claude/skills/impeccable/scripts/detect.mjs --json <scan.targets joined by spaces>` once** (the bundled detector over local files: no network, no npx). `scan.via` tells you what they are: `git-changes` (the markup/style files in your dirty tree, the most relevant set), `source-dir` (e.g. `src`, `app`), `html`, or `root`. Fold the hits into your picks: many quality / contrast hits → `audit` or `polish`; a specific slop family → the matching command (gradient text or eyebrows → `quieter` / `typeset`, flat or gray palette → `colorize`, and so on). It's a real, current signal that beats guessing. If detect errors or the tree is large and slow, skip it and recommend the user run `audit` themselves; never block the suggestion on it.

   Keep it to 2-3 pointed picks with the exact command to type. The menu stays the fallback; the recommendation is the lede.
2. **First word matches a command**: load its reference file and follow its instructions. Everything after the command name is the target.
3. **First word doesn't match, but the intent clearly maps to one command** (e.g. "fix the spacing" → `layout`, "rewrite this error message" → `clarify`, "the colors feel flat" → `colorize`): load that command's reference and proceed as if invoked. If two commands could fit, ask once which.
4. **No clear command match**: general design invocation. Apply the setup steps, the General rules, and the loaded register reference, using the full argument as context.

Setup (context gathering, register) is already loaded by then; sub-commands don't re-invoke `/impeccable`.

If the first word is `craft`, setup still runs first, but [reference/craft.md](reference/craft.md) owns the rest of the flow. If setup invokes `init` as a blocker, finish init, refresh context, then resume the original command and target.

`teach` is a deprecated alias for `init`: if the user types it, load [reference/init.md](reference/init.md) and proceed as if they ran `init`.

## Pin / Unpin

**Pin** creates a standalone shortcut so `/<command>` invokes `/impeccable <command>` directly. **Unpin** removes it. The script writes to every harness directory present in the project.

```bash
node .claude/skills/impeccable/scripts/pin.mjs <pin|unpin> <command>
```

Valid `<command>` is any command from the table above. Report the script's result concisely. Confirm the new shortcut on success, relay stderr verbatim on error.