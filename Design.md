web application/stitch/projects/11951250988679903863/screens/10389149578243185205  
\# Design System Inspired by Wayground

\#\# 1\. Visual Theme & Atmosphere

Wayground's design system embodies a modern, educational, and approachable aesthetic tailored for learning platforms spanning K-12, corporate, and higher education environments. The visual language balances professionalism with accessibility, using a refined color palette that evokes trust and clarity while maintaining playful, illustrative elements for engagement. The design prioritizes clear information hierarchy, generous whitespace, and intuitive navigation to support diverse user groups—from students to administrators. Soft gradients and subtle shadows create depth without overwhelming the interface, while bright accent colors (magenta, electric blue, teal) draw attention to interactive elements and key calls-to-action. The overall mood is inclusive, progressive, and welcoming—designed to make learning management feel approachable rather than intimidating.

\*\*Key Characteristics\*\*

\- Clean, modern aesthetic with strong typographic hierarchy  
\- Bright, vibrant accent colors (magenta, blue, green, orange) layered over neutral foundations  
\- Soft, accessible color palette with generous contrast ratios  
\- Minimal shadows and subtle elevation for depth  
\- Rounded corners (\`8px\`) for approachability  
\- DM Sans typeface throughout for consistency and legibility  
\- Inclusive whitespace supporting cognitive load reduction  
\- Educational icon system with playful, illustrative style

\#\# 2\. Color Palette & Roles

\#\#\# Primary

\- \*\*Primary Dark Charcoal\*\* (\`\#121517\`): Dominant text color, headings, and interface chrome; establishes visual foundation  
\- \*\*Electric Blue\*\* (\`\#1668F3\`): Primary interactive elements, links, and accents; signals actionability  
\- \*\*Deep Blue\*\* (\`\#0C4CC0\`): Secondary primary for darker contexts and hover states; reinforces trust

\#\#\# Accent Colors

\- \*\*Vibrant Magenta\*\* (\`\#FF319F\`): Call-to-action borders, interactive highlights, and emotional engagement  
\- \*\*Fresh Green\*\* (\`\#13AA64\`): Positive actions, success states, and validation feedback  
\- \*\*Warm Orange\*\* (\`\#F28D07\`): Warning states, notifications, and secondary emphasis

\#\#\# Interactive

\- \*\*Sky Blue Light\*\* (\`\#B9D5FF\`): Hover backgrounds, focus states, and input focus indicators  
\- \*\*Pure White\*\* (\`\#FFFFFF\`): Button backgrounds, card surfaces, and primary content areas  
\- \*\*True Black\*\* (\`\#000000\`): High-contrast text, form inputs, and critical information

\#\#\# Neutral Scale

\- \*\*Near Black\*\* (\`\#090909\`): Secondary text, disabled states, and body copy emphasis  
\- \*\*Dark Gray\*\* (\`\#262A30\`): Tertiary text and subtle UI elements  
\- \*\*Light Gray\*\* (\`\#EAEDF0\`): Dividers, borders, and inactive states  
\- \*\*Off White\*\* (\`\#F9FAFB\`): Subtle backgrounds and secondary surfaces

\#\#\# Surface & Borders

\- \*\*White Surface\*\* (\`\#FFFFFF\`): Primary background for cards, modals, and containers  
\- \*\*Pale Neutral\*\* (\`\#EAEDF0\`): Border color for default inputs and container outlines  
\- \*\*Soft Blue Background\*\* (\`\#F0F5FF\`): Secondary surface for filters and quiet sections  
\- \*\*Pale Yellow\*\* (\`\#FFF5F5\`): Warm background for secondary content sections  
\- \*\*Pale Pink\*\* (\`\#FEE7E8\`): Tertiary background for accent sections

\#\#\# Semantic / Status

\- \*\*Error Red\*\* (\`\#DD0E18\`): Primary error and danger states, validation failures  
\- \*\*Dark Error Red\*\* (\`\#C10609\`): Darker error context for emphasis and hover states on error elements

\#\# 3\. Typography Rules

\#\#\# Font Family

\*\*Primary:\*\* DM Sans, \-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

\*\*Secondary:\*\* DM Sans (no alternate; system stack as fallback)

\#\#\# Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |  
|------|------|------|--------|-------------|----------------|-------|  
| Display | DM Sans | 32px | 600 | 40px | \-0.5px | Page titles, major section headers |  
| Heading H1 | DM Sans | 28px | 600 | 36px | \-0.3px | Main content headings |  
| Heading H2 | DM Sans | 24px | 600 | 32px | 0px | Section headers |  
| Heading H3 | DM Sans | 20px | 600 | 28px | 0px | Subsection headers |  
| Body Large | DM Sans | 18px | 400 | 28px | 0px | Leading paragraph text |  
| Body | DM Sans | 16px | 400 | 24px | 0px | Primary body text, form labels |  
| Body Small | DM Sans | 14px | 400 | 20px | 0px | Secondary text, descriptions |  
| Button | DM Sans | 16px | 400 | 24px | 0px | Interactive button text |  
| Button Small | DM Sans | 12px | 600 | 16px | 0px | Compact button text, badges |  
| Caption | DM Sans | 12px | 400 | 16px | 0.2px | Helper text, metadata |  
| Link | DM Sans | 16px | 400 | 24px | 0px | Inline and standalone links |  
| Code | DM Sans | 13px | 400 | 18px | 0px | Monospace-style code display |

\#\#\# Principles

\- Single typeface throughout ensures visual cohesion and simplifies implementation  
\- Font weight restricted to 400 (regular) and 600 (semibold) for predictability and performance  
\- Line height scaled generously to improve readability on small screens and in complex layouts  
\- Heading hierarchy reinforced through size and weight combination, not font-family change  
\- 16px baseline for body text matches native mobile sizing conventions  
\- Letter spacing minimal except captions for emphasis without compromising legibility  
\- All type should be rendered with \`-webkit-font-smoothing: antialiased\` for crispness

\#\# 4\. Component Stylings

\#\#\# Buttons

\#\#\#\# Primary Button

\- \*\*Background:\*\* \`\#1668F3\`  
\- \*\*Text Color:\*\* \`\#FFFFFF\`  
\- \*\*Font Size:\*\* \`16px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Padding:\*\* \`12px 24px\`  
\- \*\*Border Radius:\*\* \`8px\`  
\- \*\*Border:\*\* \`2px solid \#1668F3\`  
\- \*\*Height:\*\* \`44px\`  
\- \*\*Line Height:\*\* \`24px\`  
\- \*\*Hover State:\*\* Background \`\#0C4CC0\`, border color \`\#0C4CC0\`  
\- \*\*Active State:\*\* Background \`\#0A3A8C\`, border color \`\#0A3A8C\`  
\- \*\*Focus State:\*\* Box-shadow \`0 0 0 4px rgba(22, 104, 243, 0.2)\`  
\- \*\*Disabled State:\*\* Background \`\#EAEDF0\`, text color \`\#262A30\`, border color \`\#EAEDF0\`

\#\#\#\# Secondary Button

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Text Color:\*\* \`\#121517\`  
\- \*\*Font Size:\*\* \`16px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Padding:\*\* \`12px 24px\`  
\- \*\*Border Radius:\*\* \`8px\`  
\- \*\*Border:\*\* \`2px solid \#EAEDF0\`  
\- \*\*Height:\*\* \`44px\`  
\- \*\*Line Height:\*\* \`24px\`  
\- \*\*Hover State:\*\* Background \`\#F9FAFB\`, border color \`\#262A30\`  
\- \*\*Active State:\*\* Background \`\#EAEDF0\`, border color \`\#121517\`  
\- \*\*Focus State:\*\* Box-shadow \`0 0 0 4px rgba(233, 237, 240, 0.6)\`  
\- \*\*Disabled State:\*\* Background \`\#F9FAFB\`, text color \`\#EAEDF0\`, border color \`\#EAEDF0\`

\#\#\#\# Ghost Button

\- \*\*Background:\*\* \`transparent\`  
\- \*\*Text Color:\*\* \`\#121517\`  
\- \*\*Font Size:\*\* \`16px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Padding:\*\* \`4px 12px\`  
\- \*\*Border Radius:\*\* \`8px\`  
\- \*\*Border:\*\* \`1px solid transparent\`  
\- \*\*Height:\*\* \`26px\`  
\- \*\*Line Height:\*\* \`24px\`  
\- \*\*Hover State:\*\* Background \`rgba(22, 104, 243, 0.08)\`, text color \`\#1668F3\`  
\- \*\*Active State:\*\* Background \`rgba(22, 104, 243, 0.16)\`, text color \`\#0C4CC0\`  
\- \*\*Focus State:\*\* Box-shadow \`0 0 0 3px rgba(22, 104, 243, 0.15)\`  
\- \*\*Disabled State:\*\* Text color \`\#EAEDF0\`

\#\#\#\# Accent (Magenta) Button

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Text Color:\*\* \`\#121517\`  
\- \*\*Font Size:\*\* \`16px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Padding:\*\* \`8px 16px\`  
\- \*\*Border Radius:\*\* \`8px\`  
\- \*\*Border:\*\* \`2px solid \#FF319F\`  
\- \*\*Height:\*\* \`34px\`  
\- \*\*Line Height:\*\* \`24px\`  
\- \*\*Hover State:\*\* Background \`\#FEE7E8\`, border color \`\#DD0E18\`  
\- \*\*Active State:\*\* Background \`\#FEE7E8\`, border color \`\#C10609\`, text color \`\#DD0E18\`  
\- \*\*Focus State:\*\* Box-shadow \`0 0 0 4px rgba(255, 49, 159, 0.2)\`  
\- \*\*Disabled State:\*\* Background \`\#F9FAFB\`, border color \`\#EAEDF0\`, text color \`\#EAEDF0\`

\#\#\#\# Button Compact

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Text Color:\*\* \`\#121517\`  
\- \*\*Font Size:\*\* \`12px\`  
\- \*\*Font Weight:\*\* \`600\`  
\- \*\*Padding:\*\* \`6px 12px\`  
\- \*\*Border Radius:\*\* \`6px\`  
\- \*\*Border:\*\* \`1px solid \#C9CED4\`  
\- \*\*Height:\*\* \`28px\`  
\- \*\*Line Height:\*\* \`16px\`  
\- \*\*Hover State:\*\* Background \`\#F9FAFB\`, border color \`\#121517\`  
\- \*\*Active State:\*\* Background \`\#EAEDF0\`  
\- \*\*Focus State:\*\* Box-shadow \`0 0 0 3px rgba(22, 104, 243, 0.15)\`

\#\#\# Cards & Containers

\#\#\#\# Card Default

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Border:\*\* \`1px solid \#EAEDF0\`  
\- \*\*Border Radius:\*\* \`12px\`  
\- \*\*Padding:\*\* \`24px\`  
\- \*\*Box Shadow:\*\* \`0 1px 3px rgba(0, 0, 0, 0.08)\`  
\- \*\*Text Color:\*\* \`\#121517\`

\#\#\#\# Card Hover

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Border:\*\* \`1px solid \#B9D5FF\`  
\- \*\*Box Shadow:\*\* \`0 4px 12px rgba(22, 104, 243, 0.12)\`  
\- \*\*Transition:\*\* \`all 200ms ease-in-out\`

\#\#\#\# Card Interactive (Selection)

\- \*\*Background:\*\* \`\#F0F5FF\`  
\- \*\*Border:\*\* \`2px solid \#1668F3\`  
\- \*\*Box Shadow:\*\* \`0 2px 8px rgba(22, 104, 243, 0.16)\`

\#\#\#\# Container Section

\- \*\*Background:\*\* \`\#F9FAFB\`  
\- \*\*Border Radius:\*\* \`12px\`  
\- \*\*Padding:\*\* \`48px\`  
\- \*\*Margin:\*\* \`0 auto\`  
\- \*\*Max Width:\*\* \`1200px\`

\#\#\#\# Container Modal

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Border Radius:\*\* \`16px\`  
\- \*\*Padding:\*\* \`32px\`  
\- \*\*Box Shadow:\*\* \`0 20px 60px rgba(0, 0, 0, 0.16)\`  
\- \*\*Backdrop:\*\* \`rgba(0, 0, 0, 0.4)\`

\#\#\# Inputs & Forms

\#\#\#\# Input Text Default

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Border:\*\* \`1px solid \#EAEDF0\`  
\- \*\*Border Radius:\*\* \`8px\`  
\- \*\*Padding:\*\* \`10px 14px\`  
\- \*\*Font Size:\*\* \`16px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Line Height:\*\* \`24px\`  
\- \*\*Text Color:\*\* \`\#121517\`  
\- \*\*Height:\*\* \`40px\`  
\- \*\*Placeholder Color:\*\* \`\#262A30\`

\#\#\#\# Input Text Focus

\- \*\*Border:\*\* \`2px solid \#1668F3\`  
\- \*\*Box Shadow:\*\* \`0 0 0 4px rgba(22, 104, 243, 0.15)\`  
\- \*\*Outline:\*\* \`none\`  
\- \*\*Transition:\*\* \`border-color 200ms ease, box-shadow 200ms ease\`

\#\#\#\# Input Text Error

\- \*\*Border:\*\* \`2px solid \#DD0E18\`  
\- \*\*Box Shadow:\*\* \`0 0 0 4px rgba(221, 14, 24, 0.12)\`

\#\#\#\# Input Text Disabled

\- \*\*Background:\*\* \`\#F9FAFB\`  
\- \*\*Border:\*\* \`1px solid \#EAEDF0\`  
\- \*\*Text Color:\*\* \`\#EAEDF0\`  
\- \*\*Cursor:\*\* \`not-allowed\`

\#\#\#\# Label

\- \*\*Font Size:\*\* \`14px\`  
\- \*\*Font Weight:\*\* \`600\`  
\- \*\*Color:\*\* \`\#121517\`  
\- \*\*Margin Bottom:\*\* \`8px\`  
\- \*\*Display:\*\* \`block\`

\#\#\#\# Helper Text

\- \*\*Font Size:\*\* \`12px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Color:\*\* \`\#262A30\`  
\- \*\*Margin Top:\*\* \`4px\`

\#\#\#\# Error Message

\- \*\*Font Size:\*\* \`12px\`  
\- \*\*Font Weight:\*\* \`600\`  
\- \*\*Color:\*\* \`\#DD0E18\`  
\- \*\*Margin Top:\*\* \`4px\`  
\- \*\*Icon:\*\* Error icon preceding text

\#\#\# Navigation

\#\#\#\# Navigation Bar Primary

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Border Bottom:\*\* \`1px solid \#EAEDF0\`  
\- \*\*Padding:\*\* \`16px 24px\`  
\- \*\*Height:\*\* \`64px\`  
\- \*\*Box Shadow:\*\* \`0 2px 8px rgba(0, 0, 0, 0.04)\`  
\- \*\*Display:\*\* \`flex\`  
\- \*\*Align Items:\*\* \`center\`  
\- \*\*Justify Content:\*\* \`space-between\`

\#\#\#\# Navigation Link Default

\- \*\*Font Size:\*\* \`16px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Color:\*\* \`\#121517\`  
\- \*\*Text Decoration:\*\* \`none\`  
\- \*\*Padding:\*\* \`8px 16px\`  
\- \*\*Border Radius:\*\* \`6px\`  
\- \*\*Transition:\*\* \`color 200ms ease, background-color 200ms ease\`

\#\#\#\# Navigation Link Active

\- \*\*Color:\*\* \`\#1668F3\`  
\- \*\*Background:\*\* \`\#F0F5FF\`  
\- \*\*Font Weight:\*\* \`600\`

\#\#\#\# Navigation Link Hover

\- \*\*Color:\*\* \`\#1668F3\`  
\- \*\*Background:\*\* \`rgba(22, 104, 243, 0.08)\`

\#\#\#\# Logo

\- \*\*Height:\*\* \`32px\`  
\- \*\*Display:\*\* \`flex\`  
\- \*\*Align Items:\*\* \`center\`

\#\#\#\# Authentication Links (Top Right)

\- \*\*Gap:\*\* \`12px\`  
\- \*\*Display:\*\* \`flex\`  
\- \*\*Align Items:\*\* \`center\`

\#\#\#\# "Enter join code" Button

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Border:\*\* \`1px solid \#EAEDF0\`  
\- \*\*Padding:\*\* \`10px 16px\`  
\- \*\*Border Radius:\*\* \`8px\`  
\- \*\*Font Size:\*\* \`14px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Color:\*\* \`\#121517\`

\#\#\#\# "Log in" Button

\- \*\*Background:\*\* \`\#FFFFFF\`  
\- \*\*Border:\*\* \`2px solid \#FF319F\`  
\- \*\*Padding:\*\* \`10px 16px\`  
\- \*\*Border Radius:\*\* \`8px\`  
\- \*\*Font Size:\*\* \`14px\`  
\- \*\*Font Weight:\*\* \`400\`  
\- \*\*Color:\*\* \`\#121517\`  
\- \*\*Hover State:\*\* Background \`\#FEE7E8\`

\#\#\# Badges & Status Indicators

\#\#\#\# Badge Success

\- \*\*Background:\*\* \`\#E8F7F0\`  
\- \*\*Text Color:\*\* \`\#13AA64\`  
\- \*\*Border:\*\* \`1px solid \#13AA64\`  
\- \*\*Padding:\*\* \`6px 12px\`  
\- \*\*Border Radius:\*\* \`6px\`  
\- \*\*Font Size:\*\* \`12px\`  
\- \*\*Font Weight:\*\* \`600\`

\#\#\#\# Badge Error

\- \*\*Background:\*\* \`\#FEE7E8\`  
\- \*\*Text Color:\*\* \`\#DD0E18\`  
\- \*\*Border:\*\* \`1px solid \#DD0E18\`  
\- \*\*Padding:\*\* \`6px 12px\`  
\- \*\*Border Radius:\*\* \`6px\`  
\- \*\*Font Size:\*\* \`12px\`  
\- \*\*Font Weight:\*\* \`600\`

\#\#\#\# Badge Warning

\- \*\*Background:\*\* \`\#FEF3E6\`  
\- \*\*Text Color:\*\* \`\#F28D07\`  
\- \*\*Border:\*\* \`1px solid \#F28D07\`  
\- \*\*Padding:\*\* \`6px 12px\`  
\- \*\*Border Radius:\*\* \`6px\`  
\- \*\*Font Size:\*\* \`12px\`  
\- \*\*Font Weight:\*\* \`600\`

\#\#\#\# Badge Info

\- \*\*Background:\*\* \`\#F0F5FF\`  
\- \*\*Text Color:\*\* \`\#0C4CC0\`  
\- \*\*Border:\*\* \`1px solid \#0C4CC0\`  
\- \*\*Padding:\*\* \`6px 12px\`  
\- \*\*Border Radius:\*\* \`6px\`  
\- \*\*Font Size:\*\* \`12px\`  
\- \*\*Font Weight:\*\* \`600\`

\#\# 5\. Layout Principles

\#\#\# Spacing System

Wayground uses an 4px base unit with a modular scale. All spacing values derive from multiples of 4px to maintain visual rhythm and simplify responsive scaling.

\- \*\*Base Unit:\*\* \`4px\`  
\- \*\*Micro (1x):\*\* \`4px\` — Used for tight grouping, icon spacing  
\- \*\*Extra Small (2x):\*\* \`8px\` — Used for component padding, small gaps  
\- \*\*Small (3x):\*\* \`12px\` — Used for input padding, label spacing  
\- \*\*Medium (4x):\*\* \`16px\` — Used for button padding, section padding, standard gaps  
\- \*\*Large (6x):\*\* \`24px\` — Used for card padding, medium section spacing  
\- \*\*Extra Large (12x):\*\* \`48px\` — Used for major section margins, container padding  
\- \*\*XXL (20x):\*\* \`80px\` — Used for hero spacing, page top margins

\#\#\# Grid & Container

\- \*\*Max Container Width:\*\* \`1200px\`  
\- \*\*Gutter:\*\* \`24px\` (spacing between columns)  
\- \*\*Column Strategy:\*\* 12-column grid responsive to breakpoints  
\- \*\*Section Padding:\*\* \`48px\` vertical, \`24px\` horizontal on desktop  
\- \*\*Content Width:\*\* Maximum \`1000px\` for readable line lengths  
\- \*\*Sidebar Pattern:\*\* 240px sidebar \+ 1fr content area with \`24px\` gap

\#\#\# Whitespace Philosophy

Generous whitespace prioritizes cognitive clarity and visual breathing room. Content should never feel cramped; instead, ample spacing between sections, cards, and interactive elements reduces cognitive load and improves scanability. Whitespace increases with screen size; mobile layouts use tighter spacing (\`16px\` sections), desktop layouts expand to \`48px+\`. Cards and containers consistently maintain internal padding of at least \`24px\` to prevent visual clutter.

\#\#\# Border Radius Scale

\- \*\*Sharp (0px):\*\* Reserved for special cases (images, code blocks)  
\- \*\*Subtle (4px):\*\* Used on very small elements, status badges  
\- \*\*Standard (8px):\*\* Used on buttons, inputs, small cards, and modals  
\- \*\*Medium (12px):\*\* Used on larger cards, containers, and blocks  
\- \*\*Large (16px):\*\* Used on modal windows and hero elements  
\- \*\*Extra Large (24px):\*\* Used on featured content cards and full-width sections

\#\# 6\. Depth & Elevation

| Level | Treatment | Use |  
|-------|-----------|-----|  
| Flat (0) | No shadow | Text, icons, disabled states |  
| Raised (1) | \`0 1px 3px rgba(0, 0, 0, 0.08)\` | Default cards, subtle containers |  
| Elevated (2) | \`0 2px 8px rgba(0, 0, 0, 0.12)\` | Hover cards, small modals, dropdown menus |  
| Prominent (3) | \`0 4px 12px rgba(0, 0, 0, 0.16)\` | Cards on interaction, active dropdowns |  
| Modal (4) | \`0 20px 60px rgba(0, 0, 0, 0.16)\` | Full modals, overlays, tooltips |  
| Floating (5) | \`0 25px 50px rgba(0, 0, 0, 0.25)\` | Floating action buttons, popovers |

\*\*Shadow Philosophy:\*\* Shadows are subtle and consistent, using only black at varying opacity rather than separate shadow colors. Each elevation level increases shadow blur and distance proportionally, creating visual hierarchy without overwhelming the interface. Shadows never exceed 25px spread to maintain focus and avoid visual noise. Transitions between shadow states occur over \`200ms\` for smooth, professional feel. Shadows support cognitive understanding of layering—elevated elements feel more interactive, while flat elements feel grounded.

\#\# 7\. Do's and Don'ts

\#\#\# Do

\- \*\*Use the primary blue (\`\#1668F3\`) for all interactive primary actions\*\* — CTA buttons, links, active states  
\- \*\*Maintain consistent \`8px\` border radius on all buttons and inputs\*\* — Reinforces brand cohesion  
\- \*\*Apply at least \`24px\` padding inside card containers\*\* — Ensures content breathing room  
\- \*\*Use DM Sans at \`16px\` for all body text\*\* — Maintains readability across devices  
\- \*\*Layer color with whitespace for visual hierarchy\*\* — Don't rely solely on color to communicate information  
\- \*\*Include focus states (outline or shadow) on all interactive elements\*\* — Required for keyboard navigation and accessibility  
\- \*\*Scale typography and spacing proportionally on mobile\*\* — Reduce heading sizes by 2-4px, section padding to \`16px\`  
\- \*\*Use the full color palette to communicate status\*\* — Green for success, red for error, orange for warning, blue for info  
\- \*\*Include 200ms transitions on hover/focus states\*\* — Smooth interactions signal responsiveness  
\- \*\*Employ ghost buttons sparingly for secondary, low-priority actions\*\* — Save primary buttons for main flows

\#\#\# Don't

\- \*\*Don't mix typefaces\*\* — DM Sans is the only font; use weight and size variation for hierarchy  
\- \*\*Don't use shadows larger than Elevated (3) on standard components\*\* — Breaks visual hierarchy  
\- \*\*Don't apply color alone to indicate state\*\* — Always pair with text, icons, or pattern changes for accessibility  
\- \*\*Don't exceed \`48px\` padding on cards in most contexts\*\* — Wastes valuable screen real estate  
\- \*\*Don't use default browser focus styles\*\* — Replace with Wayground focus ring (4px shadow at \`rgba(22, 104, 243, 0.2)\`)  
\- \*\*Don't place text directly on busy backgrounds\*\* — Always ensure WCAG AA contrast minimum (4.5:1)  
\- \*\*Don't animate shadows between states\*\* — Only animate color and scale; shadow should transition in \`0ms\` (no animation)  
\- \*\*Don't use error red (\`\#DD0E18\`) on non-error elements\*\* — Reserve for validation failures and critical alerts only  
\- \*\*Don't crowd interactive elements\*\* — Maintain minimum \`12px\` spacing between clickable targets  
\- \*\*Don't reduce type size below \`12px\` for body text\*\* — Compromises readability and accessibility

\#\# 8\. Responsive Behavior

\#\#\# Breakpoints

| Name | Width | Key Changes |  
|------|-------|------------|  
| Mobile Small | \`320px\` | Single column, \`16px\` margins, \`12px\` padding, 18px headings, \`1.5rem\` line-height |  
| Mobile | \`480px\` | Single column, \`16px\` margins, \`14px\` body text, standard component sizes |  
| Tablet | \`768px\` | Two-column grid, \`24px\` margins, \`16px\` padding, full-size buttons |  
| Laptop | \`1024px\` | Three-column grid, \`32px\` margins, standard layout, \`48px\` section spacing |  
| Desktop | \`1200px+\` | Full 12-column grid, \`48px\` margins, max-width containers, optimal whitespace |

\#\#\# Touch Targets

\- \*\*Minimum Interactive Height:\*\* \`44px\` (buttons, links, inputs)  
\- \*\*Minimum Interactive Width:\*\* \`44px\` (icon buttons, checkboxes, radio buttons)  
\- \*\*Minimum Spacing Between Targets:\*\* \`12px\`  
\- \*\*Recommended Button Height (Mobile):\*\* \`48px\` (easier for thumb interaction)  
\- \*\*Recommended Button Height (Desktop):\*\* \`40-44px\`  
\- \*\*Icon Button Size:\*\* \`40px × 40px\` (includes internal padding for icon)

\#\#\# Collapsing Strategy

\- \*\*Navigation:\*\* Top bar remains fixed on all breakpoints; mobile hamburger menu appears below \`768px\`  
\- \*\*Cards:\*\* Stack vertically below \`768px\`; use 2-column grid between \`768px-1024px\`; 3-column grid above \`1024px\`  
\- \*\*Forms:\*\* Full-width inputs below \`768px\`; side-by-side labels and fields above \`768px\` for longer forms  
\- \*\*Sidebar:\*\* Hide below \`1024px\`; reveal with slide-out drawer or hamburger menu  
\- \*\*Padding:\*\* Reduce from \`48px\` (desktop) to \`24px\` (tablet) to \`16px\` (mobile)  
\- \*\*Font Sizes:\*\* No change below \`768px\` (maintain readability); optionally reduce headings by \`2px\` on very small devices  
\- \*\*Button Width:\*\* Full-width (\`100%\`) below \`480px\`; standard width (\`auto\`, minimum \`121px\`) above \`480px\`

\#\# 9\. Agent Prompt Guide

\#\#\# Quick Color Reference

\- \*\*Primary CTA:\*\* Electric Blue (\`\#1668F3\`)  
\- \*\*Secondary CTA:\*\* Deep Blue (\`\#0C4CC0\`) on hover/active  
\- \*\*Error/Danger:\*\* Error Red (\`\#DD0E18\`), Dark Error (\`\#C10609\`) on darker backgrounds  
\- \*\*Success:\*\* Fresh Green (\`\#13AA64\`)  
\- \*\*Warning:\*\* Warm Orange (\`\#F28D07\`)  
\- \*\*Background (Primary):\*\* Pure White (\`\#FFFFFF\`)  
\- \*\*Background (Secondary):\*\* Off White (\`\#F9FAFB\`)  
\- \*\*Background (Accent):\*\* Soft Blue (\`\#F0F5FF\`) or Pale Pink (\`\#FEE7E8\`)  
\- \*\*Text (Primary):\*\* Primary Dark Charcoal (\`\#121517\`)  
\- \*\*Text (Secondary):\*\* Dark Gray (\`\#262A30\`)  
\- \*\*Border:\*\* Light Gray (\`\#EAEDF0\`)  
\- \*\*Disabled/Inactive:\*\* Light Gray (\`\#EAEDF0\`)  
\- \*\*Accent Border:\*\* Vibrant Magenta (\`\#FF319F\`)

\#\#\# Iteration Guide

1\. \*\*All text must use DM Sans font family\*\* with weight \`400\` (regular) or \`600\` (semibold only). No other typefaces or weights.

2\. \*\*All interactive elements (buttons, links, inputs) must have focus states\*\* using box-shadow \`0 0 0 4px rgba(22, 104, 243, 0.2)\` or equivalent for keyboard navigation.

3\. \*\*Primary buttons always use Electric Blue background (\`\#1668F3\`) with white text\*\*; secondary buttons use white background with borders.

4\. \*\*Cards and containers must maintain minimum \`24px\` internal padding\*\*; never compress below \`16px\` on mobile.

5\. \*\*All border radius values are \`8px\` for standard components, \`12px\` for cards, \`16px\` for modals\*\*; never deviate without explicit design rationale.

6\. \*\*Spacing between elements follows the 4px base unit scale:\*\* \`4px\`, \`8px\`, \`12px\`, \`16px\`, \`24px\`, \`48px\`, \`80px\`; all other spacing values must align to this scale.

7\. \*\*Color contrast must meet WCAG AA minimum (4.5:1 for text, 3:1 for graphics)\*\*; always validate against \`\#121517\` text on light backgrounds and \`\#FFFFFF\` text on dark backgrounds.

8\. \*\*Hover state transitions must occur over exactly \`200ms\` using \`ease\` or \`ease-in-out\` timing function\*\*; never instant or faster.

9\. \*\*Mobile layouts collapse to single column below \`768px\` with \`16px\` margins and padding\*\*; tablet layouts use 2-column grid; desktop uses full proportional spacing.

10\. \*\*Error messages always use Error Red (\`\#DD0E18\`), success messages use Fresh Green (\`\#13AA64\`), warnings use Warm Orange (\`\#F28D07\`)\*\*; apply these colors consistently to text, backgrounds, and borders.  
