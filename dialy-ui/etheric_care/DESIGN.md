# Design System Specification: The Serene Sanctuary

## 1. Overview & Creative North Star
**Creative North Star: The Curated Caregiver**
This design system rejects the clinical coldness often found in healthcare apps. Instead, it adopts the persona of a "Curated Caregiver"—an experience that feels high-end, editorial, and deeply supportive. We achieve this by moving away from standard "grid-and-border" layouts toward a more fluid, layered aesthetic. 

The system utilizes intentional asymmetry and overlapping "glass" containers to create a sense of movement and life, mimicking the biological rhythms of the human body. By prioritizing "breathing room" (generous whitespace) and a sophisticated hierarchy of light, we ensure that users dealing with kidney disease feel calm, not overwhelmed. This is not just an interface; it is a safe, premium space for health management.

---

## 2. Colors & Tonal Depth
Our palette is rooted in medical professionalism but elevated through soft purples and layered whites to provide warmth.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Physical boundaries must be defined solely through background color shifts or tonal transitions.
*   *Example:* Use `surface-container-low` (#f3f3fa) for a section background sitting atop a `surface` (#faf9fe) page.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, premium materials.
*   **Base:** `surface` (#faf9fe)
*   **Sectioning:** `surface-container-low` (#f3f3fa)
*   **Cards/Primary Interaction:** `surface-container-lowest` (#ffffff)
*   **Elevated Overlays:** `surface-container-high` (#e7e8f1)

### The "Glass & Gradient" Rule
To escape the "default" look, use Glassmorphism for floating navigation bars or contextual modals. Apply `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For main CTAs or Hero sections, use a subtle linear gradient: `primary` (#255db0) to `primary-container` (#75a5fd) at a 135-degree angle. This adds "soul" and depth that a flat fill cannot provide.

---

## 3. Typography: The Editorial Voice
We use a dual-typeface system to balance clinical authority with human accessibility.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism and high legibility. Large `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create an authoritative, editorial feel.
*   **Titles & Body (Lexend):** Specifically designed to reduce visual noise and improve reading speed. Use `body-lg` (1rem) for all patient instructions to ensure maximum clarity.
*   **Hierarchy as Empathy:** Use extreme scale contrast. A `display-sm` headline paired with a `label-md` category tag creates a sophisticated, "magazine" look that guides the eye naturally through complex medical data.

---

## 4. Elevation & Depth
Depth is a functional tool for kidney health monitoring—higher priority data "floats" closer to the user.

*   **The Layering Principle:** Avoid shadows where possible. Achieve "lift" by placing a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f3fa) background. 
*   **Ambient Shadows:** If a floating action button or modal requires a shadow, it must be "Ambient": 
    *   `box-shadow: 0 12px 32px -4px rgba(47, 50, 58, 0.06);`
    *   Note the use of the `on-surface` color (#2f323a) for the shadow tint rather than pure black.
*   **The "Ghost Border":** If a container requires definition against a similar background (e.g., in high-sunlight conditions), use a 1px border of `outline-variant` (#afb2bc) at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `xl` (1.5rem) roundedness. No border.
*   **Secondary:** `secondary-container` (#dae2f9) fill with `on-secondary-container` (#4a5264) text.
*   **Tertiary:** Text-only using `primary` (#255db0) with a subtle `surface-variant` background on hover.

### Input Fields & Cards
*   **Text Inputs:** Soft `surface-container-high` (#e7e8f1) fill, no border. On focus, transition to a `ghost-border` of `primary`.
*   **Cards:** Forbid divider lines. Use `md` (0.75rem) spacing between content blocks. Use background shifts (`surface-container-lowest`) to distinguish the card from the page.
*   **Progress Indicators:** Use the `tertiary` (#685783) and `tertiary-container` (#e1cbfe) for health progress bars (e.g., water intake or nutrient tracking) to provide a calming, non-alarming alternative to the primary blue.

### Specialty Components: The "Vitals" Carousel
A horizontally scrolling area using "Peek-a-boo" layouts where the next card is partially visible. Use `surface-container-lowest` cards with a `lg` (1rem) corner radius to hold key metrics like GFR levels or Blood Pressure.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a functional element to lower patient anxiety.
*   **DO** use "Lexend" for all numerical data; its character clarity is essential for medical dosage or lab results.
*   **DO** lean into the `tertiary` (purple) tones for "Support" features (chat, help, resources) to differentiate them from "Action" features (blue).

### Don't:
*   **DON'T** use 1px solid dividers to separate list items. Use 12px of vertical white space or a subtle background shift instead.
*   **DON'T** use `error` (#a83836) for anything other than critical medical alerts. For "caution" or "warning," use tonal shifts in `secondary`.
*   **DON'T** use sharp corners. Every element should have a minimum of `sm` (0.25rem) rounding to maintain a "safe and supportive" feel.
*   **DON'T** use pure black (#000000). Always use `on-background` (#2f323a) for text to reduce eye strain.