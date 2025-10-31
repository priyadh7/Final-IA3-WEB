# Expense Tracker Design Guidelines

## Design Approach

**Selected Approach:** Design System with Modern Fintech Inspiration

Drawing from industry leaders in financial technology (Mint, YNAB, Splitwise) and productivity tools (Linear, Notion), this expense tracker will emphasize clarity, data hierarchy, and efficient task completion. The design prioritizes scanability, quick data entry, and insightful visualization over decorative elements.

**Core Principles:**
- Information clarity over visual flair
- Efficient workflows with minimal friction
- Data-driven insights presented accessibly
- Professional credibility for financial trust

---

## Typography System

**Font Selection:** Google Fonts via CDN
- **Primary Font:** Inter (headings, UI elements, data)
- **Monospace Font:** JetBrains Mono (numerical values, currency amounts)

**Hierarchy:**
- **Page Titles:** text-3xl md:text-4xl, font-bold
- **Section Headings:** text-2xl, font-semibold
- **Card Titles:** text-lg, font-semibold
- **Body Text:** text-base, font-normal
- **Labels:** text-sm, font-medium
- **Helper Text:** text-xs, font-normal
- **Currency Amounts:** text-2xl md:text-3xl, font-mono, font-bold (large displays), text-base font-mono (table cells)
- **Stats:** text-4xl md:text-5xl, font-bold, font-mono

---

## Layout System

**Spacing Primitives:** Consistent use of Tailwind units **2, 4, 6, and 8**
- Gap between cards: `gap-4` or `gap-6`
- Section padding: `p-6` or `p-8`
- Form field spacing: `space-y-4`
- Container padding: `px-4 md:px-6 lg:px-8`

**Grid System:**
- Dashboard stats: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Expense cards: `grid grid-cols-1 lg:grid-cols-2 gap-4`
- Forms: Single column `max-w-2xl` for optimal readability

**Container Strategy:**
- Main content: `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`
- Forms: `max-w-2xl mx-auto`
- Dashboard sections: `w-full` with inner constraints

---

## Component Library

### Navigation & Layout

**Header (Desktop & Mobile)**
- Fixed header with logo left, navigation center, user menu right
- Height: `h-16`
- Mobile: Hamburger menu icon with slide-out drawer
- User avatar/initials in rounded circle with dropdown

**Sidebar (Dashboard)**
- Left sidebar on desktop: `w-64` fixed
- Collapsible on tablet: Icon-only mode `w-16`
- Mobile: Overlay drawer triggered by hamburger
- Navigation items with icons (Lucide React) and labels
- Active state: Subtle background treatment

**Main Content Area**
- Padding: `p-6 md:p-8`
- Background treatment to distinguish from header/sidebar
- Responsive spacing that adapts to viewport

### Data Display Components

**Stats Cards (Dashboard)**
- 4-card grid on desktop, stacked on mobile
- Structure: Icon + Label + Large Value + Change Indicator
- Icon: `w-10 h-10` in rounded container `p-2`
- Value: Large monospace font
- Trend: Small text with arrow icon (up/down)
- Border treatment: `border rounded-lg`

**Data Table (Expenses List)**
- TanStack Table with full functionality
- Header row: Sticky, `font-semibold text-sm uppercase tracking-wide`
- Rows: `border-b` separator, hover state
- Cells: `px-4 py-3`
- Actions column: Icon buttons (edit, delete)
- Pagination: Bottom with page numbers and prev/next
- Filters: Top row with category dropdown, date range picker, search input

**Expense Card (Mobile Alternative)**
- Card layout for mobile: `rounded-lg border p-4`
- Top row: Category badge + Amount (right-aligned, large, mono)
- Middle: Title (semibold), Description (smaller)
- Bottom: Date (small, muted) + Tags + Actions

### Forms

**Add/Edit Expense Form**
- Vertical layout with clear field grouping
- Fields: Title (text), Amount (number with currency symbol), Category (select with icons), Date (date picker), Description (textarea), Tags (multi-input)
- Input styling: `border rounded-md px-3 py-2`, focus states
- Labels: Above inputs, `text-sm font-medium mb-1`
- Error states: Red border + error message below field
- Submit button: Full width on mobile, auto width on desktop

**Budget Form**
- Similar structure to expense form
- Category + Monthly Amount + Month selector
- Progress indicator showing current vs budget

### Charts & Visualizations

**Monthly Spending Bar Chart**
- Recharts library implementation
- Height: `h-80`
- X-axis: Months, Y-axis: Amount
- Tooltip on hover with detailed breakdown
- Responsive: Simplify on mobile (fewer labels)

**Category Pie Chart**
- Recharts donut chart
- Legend positioned right on desktop, bottom on mobile
- Percentage labels within slices
- Size: `h-80 w-full`

**Budget vs Actual Card**
- Progress bar showing spent/remaining
- Numerical comparison above bar
- Warning states when approaching/exceeding budget

### Overlays & Modals

**Modal Dialogs**
- Centered overlay with backdrop blur
- Content: `max-w-md md:max-w-lg rounded-lg`
- Header: Title + Close button
- Body: Scrollable if needed
- Footer: Action buttons (right-aligned)

**Toast Notifications**
- Top-right corner positioning
- Auto-dismiss after 3-5 seconds
- Success, error, warning variants
- Icon + Message + Close button

---

## Page-Specific Layouts

### Landing Page
**Hero Section:**
- Height: `min-h-[80vh]`
- Two-column layout: Left (headline, description, CTA buttons), Right (dashboard mockup image or illustration)
- Headline: Very large, bold, max-w-2xl
- CTA buttons: Primary (Get Started) + Secondary (Learn More)
- Background: Subtle grid pattern or gradient

**Features Section:**
- 3-column grid on desktop: `grid-cols-1 md:grid-cols-3 gap-8`
- Feature cards: Icon + Title + Description
- Icons: Large, `w-12 h-12`
- Vertical padding: `py-20`

**Social Proof:**
- Stats row: `grid-cols-3` showing user count, expenses tracked, money saved
- Large numbers with labels

**Final CTA:**
- Centered section with headline and prominent button
- Padding: `py-16`

### Authentication Pages

**Login/Register Forms:**
- Centered card: `max-w-md mx-auto`
- Logo/brand at top
- Form fields stacked with consistent spacing
- Social login options (if applicable)
- Link to alternate page (Login ↔ Register)
- Minimal page chrome, focus on form

### Dashboard

**Layout Structure:**
- Stats cards row at top
- Two-column layout below: Chart (col-span-2) + Recent expenses (col-span-1)
- Quick actions: Floating "Add Expense" button `fixed bottom-8 right-8`

### Expenses Management Page

**Primary Layout:**
- Filter bar at top: Search + Category dropdown + Date range
- Data table as main content
- Add button: Top-right or floating

### Analytics Page

**Multi-Chart Layout:**
- Monthly trends chart: Full width
- Row of two charts: Category pie + Budget comparison
- Insights cards: Key takeaways with icons

---

## Responsive Breakpoints

- **Mobile:** < 768px - Single column, stacked stats, simplified charts
- **Tablet:** 768px - 1024px - Two columns, condensed sidebar
- **Desktop:** > 1024px - Full multi-column layouts, expanded sidebar

---

## Accessibility

- All interactive elements: Focus states with outline offset
- Form inputs: Proper labels with `for` attributes
- Buttons: Minimum touch target `min-h-10`
- Icons: Accompanied by text or aria-labels
- Tables: Proper thead/tbody structure
- Modals: Focus trapping and escape key handling

---

## Images

**Hero Section Image:**
- Placement: Right side of two-column hero layout
- Type: Mockup of dashboard interface or modern illustration showing expense tracking
- Style: Clean, professional, showing app in use
- Size: Proportional to hero height, max-width on desktop

**Feature Icons:** Use Lucide React icon library throughout - no custom images needed for UI elements