# Design System

This document outlines the design tokens, typography, colors, and layout guidelines for the wedding invitation landing page of Joao & Vitalia.

## Visual Theme & Brand Personality
The visual direction is **Luxury Editorial Stationery**. It combines the warm, organic feel of physical heavy-stock paper with modern layout patterns, classical serif typography, and elegant script headers. It is soft, romantic, clean, and highly readable.

## Color Tokens
We use a strict 3-color palette modeled on the physical invitation assets. The primary colors are mapped to CSS custom variables:

| Token Name | Hex Code | OKLCH Code | Role / Usage |
| :--- | :--- | :--- | :--- |
| `--color-cream` (Base) | `#F2EBDD` | `oklch(0.93 0.02 75)` | Main background, clean card layouts, and subtle warm tints. |
| `--color-navy` (Ink) | `#0D1B34` | `oklch(0.18 0.05 255)` | Main readable text, headings, buttons, and high-contrast lines. |
| `--color-sage` (Decor) | `#A7B49A` | `oklch(0.72 0.03 135)` | Decorative borders, timeline tracks, fine lines, and icons. |

### Color Usage
- **Body Background**: `--color-cream` (#F2EBDD).
- **Body Text**: `--color-navy` (#0D1B34). (Contrast ratio is ~14.2:1 against cream, exceeding WCAG AAA standards).
- **Accents**: Subtle usage of `--color-sage` (#A7B49A) for lines, double borders, and secondary visual dividers.

## Typography Tokens
We import Cormorant Garamond, Great Vibes, and Montserrat from Google Fonts to build our type scale:

- **Display Script Font**: `'Great Vibes', cursive`. Used exclusively for the names of the couple and decorative section titles.
- **Serif Font**: `'Cormorant Garamond', serif`. Used for general content headings, paragraphs, dates, and quotes. It is classic, elegant, and highly legible.
- **Sans-Serif Font**: `'Montserrat', sans-serif`. Used for tiny utility text, labels, calendar details, copy buttons, and number displays to provide sharp, modern contrast and readability.

### Type Scale
- **H1 (Hero Names)**: `clamp(3rem, 8vw, 6.5rem)` (Great Vibes). Floor: 48px, Ceiling: 104px.
- **H2 (Section Headings)**: `clamp(2rem, 5vw, 3.5rem)` (Cormorant Garamond).
- **H3 (Sub-headings / Detail Headers)**: `clamp(1.25rem, 3vw, 1.75rem)` (Cormorant Garamond).
- **Body Text**: `clamp(1rem, 2vw, 1.15rem)` (Cormorant Garamond). Line height: `1.6`.
- **Utility / Labels**: `0.85rem` to `0.9rem` (Montserrat). Letter-spacing: `0.05em`.

## Spacing Scale
A fluid padding and margin system based on REMs ensures full flexibility on smaller screens:

- `--space-xs`: `0.5rem` (8px)
- `--space-sm`: `1rem` (16px)
- `--space-md`: `1.5rem` (24px)
- `--space-lg`: `2.5rem` (40px)
- `--space-xl`: `4rem` (64px)
- `--container-width`: `650px` (max-width for readable invite flow).

## Motion & Transitions
Transitions are designed to feel like an unfolding card. No bounce or snappy springs are allowed; everything uses a smooth deceleration.

- **Easing Curve**: `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart).
- **State Changes**: `150ms` (buttons, icons, copy effects).
- **Section Reveals**: `600ms` with a slow translation slide (`translateY(20px) -> translateY(0)`).
- **Reduced Motion**: Under `@media (prefers-reduced-motion: reduce)`, reveals translate to an instant opacity transition.

## Key UI Components
1. **Floating Audio Player**: Discrete control in the bottom-right corner. Features a circular play/pause state with an active audio-wave visualizer.
2. **Timeline Vertical Tracker**: Center line in sage green, with circle-nodes displaying the timeline. Text alternates on desktop, and stacks on mobile.
3. **Restrictions Grid**: A highly visual dress code warning system showing forbidden colors in small swatch elements, crossed out elegantly to prevent dress code issues.
4. **Copy-to-Clipboard Utility**: Integrated directly into bank accounts and Falabella registry code so guests can tap and copy instantly without highlighting text.
5. **Supabase RSVP Storage**: A client-side integration using the official Supabase JavaScript SDK loaded via CDN. Submits names, phone numbers, attendance confirmation, and custom guest notes directly to the `rsvp` table.
