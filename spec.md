# India Fund & Scheme Tracker — Project Specification

## Overview

A public transparency platform that helps Indian citizens discover government schemes, scholarships, agriculture programs, and welfare benefits across India. Built with React, Tailwind CSS, and powered by Lovable Cloud (Supabase) for backend services.

**Published URL:** https://fundwatch-spotlight.lovable.app

---

## Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Frontend     | React 18, TypeScript, Vite                      |
| Styling      | Tailwind CSS, shadcn/ui, Framer Motion          |
| State        | React Context, TanStack React Query             |
| Routing      | React Router DOM v6                             |
| Backend      | Lovable Cloud (Supabase) — PostgreSQL, Auth, Edge Functions |
| AI Chat      | Edge Function (`pft-chat`) via Lovable AI       |
| Forms        | React Hook Form, Zod validation                 |
| Charts       | Recharts                                        |

---

## Folder Structure

```
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/                        # Static images and assets
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── Chatbot.tsx                # AI-powered chatbot widget
│   │   ├── Footer.tsx                 # App footer
│   │   ├── LanguageSelector.tsx       # Language toggle (English/Tamil)
│   │   ├── NavLink.tsx                # Navigation link component
│   │   ├── Navbar.tsx                 # Top navigation bar
│   │   ├── ProtectedRoute.tsx         # Auth guard — redirects unauthenticated users
│   │   ├── SchemeApplyButton.tsx      # "Apply Now" button with official portal redirect
│   │   ├── SchemeCard.tsx             # Scheme summary card
│   │   ├── StatCard.tsx               # Dashboard statistic card
│   │   ├── StateSelector.tsx          # Indian state dropdown selector
│   │   └── TricolorBackground.tsx     # Animated tricolor background effect
│   ├── contexts/
│   │   ├── AuthContext.tsx            # Authentication state (user, login, logout)
│   │   ├── LanguageContext.tsx        # i18n language state
│   │   └── StateContext.tsx           # Selected Indian state context
│   ├── hooks/
│   │   ├── use-mobile.tsx             # Mobile breakpoint detection
│   │   ├── use-toast.ts               # Toast notification hook
│   │   ├── useGovernmentSchemes.ts    # Fetch government schemes from DB
│   │   ├── useSchemes.ts             # Fetch budget/expense schemes from DB
│   │   └── useScholarships.ts        # Fetch scholarships from DB
│   ├── integrations/
│   │   ├── lovable/index.ts           # Lovable Cloud auth client
│   │   └── supabase/
│   │       ├── client.ts              # Supabase client instance (auto-generated)
│   │       └── types.ts               # Database types (auto-generated)
│   ├── lib/
│   │   ├── officialPortals.ts         # Official government portal URLs
│   │   └── utils.ts                   # Utility functions (cn, etc.)
│   ├── pages/
│   │   ├── AnalyticsPage.tsx          # Budget analytics & charts
│   │   ├── Dashboard.tsx              # Main dashboard with stats
│   │   ├── GovtSchemeDetailPage.tsx   # Government scheme detail view
│   │   ├── GovtSchemesPage.tsx        # Government schemes listing
│   │   ├── Index.tsx                  # Index redirect
│   │   ├── LandingPage.tsx            # Home/landing page with categories
│   │   ├── LoginPage.tsx              # Login page (email, password, Google OAuth)
│   │   ├── NotFound.tsx               # 404 page
│   │   ├── PaymentPage.tsx            # UPI payment/support page
│   │   ├── SchemeDetailPage.tsx       # Budget scheme detail view
│   │   ├── SchemesPage.tsx            # Budget schemes listing
│   │   ├── ScholarshipDetailPage.tsx  # Scholarship detail view
│   │   ├── ScholarshipsPage.tsx       # Scholarships listing
│   │   └── SignUpPage.tsx             # User registration page
│   ├── test/
│   │   ├── example.test.ts
│   │   └── setup.ts
│   ├── App.tsx                        # Root component with routing
│   ├── App.css
│   ├── index.css                      # Tailwind base + design tokens
│   └── main.tsx                       # Entry point
├── supabase/
│   ├── config.toml                    # Supabase project config
│   └── functions/
│       └── pft-chat/
│           └── index.ts               # AI chatbot edge function
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## User Flow

```
App Open
  │
  ├─► Login Page (/login)
  │     ├── Login with Mobile + Password
  │     ├── Sign Up (/signup)
  │     └── Continue with Google (OAuth)
  │
  ▼
Payment Page (/welcome)
  │   Title: "Support India Fund & Scheme Tracker"
  │   UPI ID: gobinathr735-1@okicici
  │   Minimum: ₹2
  │   Options: Google Pay, PhonePe, Paytm, UPI, QR
  │   Buttons: "Pay Now" | "Skip & Continue"
  │
  ▼
Home Page (/) — Protected
  │   Dashboard, Categories, Scheme Cards
  │   Floating "Support" button → /welcome
  │
  ├── /dashboard          — Stats & overview
  ├── /schemes            — Budget scheme listing
  ├── /schemes/:id        — Scheme detail
  ├── /scholarships       — Scholarship listing
  ├── /scholarships/:id   — Scholarship detail
  ├── /govt-schemes       — Government scheme listing
  ├── /govt-schemes/:id   — Government scheme detail
  └── /analytics          — Budget analytics & charts
```

**Access Rule:** All routes except `/login`, `/signup`, and `/welcome` require authentication via `ProtectedRoute`.

**Google OAuth Rule:** Google sign-in always redirects to `/welcome` (Payment Page) before the Home Page.

---

## Main Features

### 1. Authentication
- Email/password login and signup
- Google OAuth (via Lovable Cloud)
- Protected routes with auth guard
- Profile creation on signup (name, DOB, age, gender, mobile)

### 2. Payment / Support Page
- UPI payment integration (QR code + deep link)
- Mandatory stop after login, before accessing the app
- "Pay Now" opens UPI intent; "Skip & Continue" proceeds to Home

### 3. Government Schemes Browser
- Filter by state, category, government type
- Categories: Medical & Health, Insurance, Welfare Board, Disability, Senior Citizen, Women Welfare, Agriculture, Housing, Employment, Social Justice
- Detail pages with eligibility, documents, application process

### 4. Scholarships Browser
- Filter by education level, category, gender eligibility
- Categories: Merit, Financial, Minority, SC/ST, BC/OBC, Women, Disability, General
- Education levels: School, College, Engineering, Medical, Postgraduate, All

### 5. Budget Schemes & Analytics
- Scheme budget tracking (total budget, spent, status)
- District-level allocation data
- Expense tracking with proof/verification status
- Charts and analytics dashboard (Recharts)

### 6. AI Chatbot
- Powered by Lovable AI edge function (`pft-chat`)
- Context-aware responses about schemes and eligibility
- Floating chat widget on all protected pages

### 7. Multi-language Support
- English and Tamil (via LanguageContext)
- Scheme names and descriptions in both languages

### 8. State-based Filtering
- State selector persisted via StateContext
- Filters schemes, scholarships, and analytics by selected state

---

## Database Schema

### `profiles`
| Column         | Type        | Nullable | Default       |
| -------------- | ----------- | -------- | ------------- |
| id             | uuid (PK)   | No       | —             |
| full_name      | text        | No       | `''`          |
| date_of_birth  | date        | Yes      | —             |
| age            | integer     | Yes      | —             |
| gender         | text        | Yes      | —             |
| mobile_number  | text        | Yes      | —             |
| created_at     | timestamptz | No       | `now()`       |
| updated_at     | timestamptz | No       | `now()`       |

**RLS:** Authenticated users can SELECT, INSERT, UPDATE their own profile only.

---

### `government_schemes`
| Column              | Type                    | Nullable | Default        |
| ------------------- | ----------------------- | -------- | -------------- |
| id                  | uuid (PK)               | No       | `gen_random_uuid()` |
| name                | text                    | No       | —              |
| description         | text                    | No       | —              |
| department          | text                    | No       | —              |
| category            | govt_scheme_category    | No       | —              |
| government_type     | government_type         | No       | `'Central'`    |
| state               | text                    | No       | `'All India'`  |
| status              | scheme_status           | No       | `'Active'`     |
| benefit_amount      | text                    | No       | —              |
| eligibility_criteria| text                    | No       | —              |
| gender_eligibility  | gender_eligibility      | No       | `'Both'`       |
| age_min             | integer                 | Yes      | —              |
| age_max             | integer                 | Yes      | —              |
| income_limit        | bigint                  | Yes      | —              |
| required_documents  | text[]                  | No       | `'{}'`         |
| application_process | text                    | Yes      | —              |
| application_link    | text                    | Yes      | —              |
| target_beneficiaries| text                    | Yes      | —              |
| premium             | text                    | Yes      | —              |
| coverage_amount     | text                    | Yes      | —              |
| start_date          | date                    | Yes      | —              |
| end_date            | date                    | Yes      | —              |
| created_at          | timestamptz             | No       | `now()`        |
| updated_at          | timestamptz             | No       | `now()`        |

**RLS:** Public read access. No insert/update/delete.

---

### `scholarships`
| Column              | Type                    | Nullable | Default          |
| ------------------- | ----------------------- | -------- | ---------------- |
| id                  | uuid (PK)               | No       | `gen_random_uuid()` |
| name                | text                    | No       | —                |
| description         | text                    | No       | —                |
| department          | text                    | No       | —                |
| category            | scholarship_category    | No       | `'General'`      |
| education_level     | education_level         | No       | `'All'`          |
| government_type     | government_type         | No       | `'Central'`      |
| state               | text                    | No       | `'All India'`    |
| status              | scheme_status           | No       | `'Active'`       |
| benefit_amount      | text                    | No       | —                |
| eligibility_criteria| text                    | No       | —                |
| gender_eligibility  | gender_eligibility      | No       | `'Both'`         |
| age_min             | integer                 | Yes      | —                |
| age_max             | integer                 | Yes      | —                |
| income_limit        | bigint                  | Yes      | —                |
| course_type         | text                    | Yes      | —                |
| required_documents  | text[]                  | No       | `'{}'`           |
| application_process | text                    | Yes      | —                |
| application_link    | text                    | Yes      | —                |
| start_date          | date                    | Yes      | —                |
| end_date            | date                    | Yes      | —                |
| created_at          | timestamptz             | No       | `now()`          |
| updated_at          | timestamptz             | No       | `now()`          |

**RLS:** Public read access. No insert/update/delete.

---

### `schemes`
| Column              | Type              | Nullable | Default            |
| ------------------- | ----------------- | -------- | ------------------ |
| id                  | uuid (PK)         | No       | `gen_random_uuid()` |
| name                | text              | No       | —                  |
| name_ta             | text              | Yes      | —                  |
| description         | text              | No       | —                  |
| description_ta      | text              | Yes      | —                  |
| department          | text              | No       | —                  |
| category            | scheme_category   | No       | —                  |
| government_type     | government_type   | No       | `'State'`          |
| state               | text              | Yes      | —                  |
| status              | scheme_status     | No       | `'Active'`         |
| total_budget        | bigint            | No       | —                  |
| spent               | bigint            | No       | `0`                |
| target_beneficiaries| text              | Yes      | —                  |
| announcement_date   | date              | Yes      | —                  |
| start_date          | date              | Yes      | —                  |
| end_date            | date              | Yes      | —                  |
| created_at          | timestamptz       | No       | `now()`            |
| updated_at          | timestamptz       | No       | `now()`            |

**RLS:** Public read access. No insert/update/delete.

---

### `district_allocations`
| Column     | Type        | Nullable | Default             |
| ---------- | ----------- | -------- | ------------------- |
| id         | uuid (PK)   | No       | `gen_random_uuid()` |
| scheme_id  | uuid (FK)   | No       | —                   |
| district   | text        | No       | —                   |
| state      | text        | Yes      | —                   |
| allocated  | bigint      | No       | —                   |
| spent      | bigint      | No       | `0`                 |
| created_at | timestamptz | No       | `now()`             |

**FK:** `scheme_id → schemes.id`
**RLS:** Public read access. No insert/update/delete.

---

### `expenses`
| Column       | Type           | Nullable | Default             |
| ------------ | -------------- | -------- | ------------------- |
| id           | uuid (PK)      | No       | `gen_random_uuid()` |
| scheme_id    | uuid (FK)      | No       | —                   |
| title        | text           | No       | —                   |
| description  | text           | Yes      | —                   |
| amount       | bigint         | No       | —                   |
| category     | text           | No       | —                   |
| department   | text           | No       | —                   |
| district     | text           | No       | —                   |
| state        | text           | Yes      | —                   |
| expense_date | date           | No       | —                   |
| status       | expense_status | No       | `'Pending'`         |
| has_proof    | boolean        | No       | `false`             |
| proof_url    | text           | Yes      | —                   |
| geo_lat      | float8         | Yes      | —                   |
| geo_lng      | float8         | Yes      | —                   |
| created_at   | timestamptz    | No       | `now()`             |

**FK:** `scheme_id → schemes.id`
**RLS:** Public read access. No insert/update/delete.

---

### Enums

| Enum Name              | Values                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `government_type`      | Central, State                                                                                 |
| `scheme_status`        | Active, Completed, Upcoming, Suspended                                                         |
| `scheme_category`      | Education, Healthcare, Agriculture, Welfare, Infrastructure, Housing, Employment, Women & Child, Social Justice |
| `govt_scheme_category` | Medical & Health, Insurance, Welfare Board, Disability, Senior Citizen, Women Welfare, Agriculture, Housing, Employment, Social Justice |
| `scholarship_category` | Merit, Financial, Minority, SC/ST, BC/OBC, Women, Disability, General                          |
| `education_level`      | School, College, Engineering, Medical, Postgraduate, All                                       |
| `gender_eligibility`   | Boys, Girls, Both                                                                              |
| `expense_status`       | Verified, Pending, Flagged, Rejected                                                           |

---

### Database Functions

| Function                | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `handle_new_user()`     | Trigger: auto-creates profile row on user signup |
| `update_updated_at_column()` | Trigger: updates `updated_at` timestamp     |

---

## Edge Functions

| Function   | Path                        | JWT | Purpose                    |
| ---------- | --------------------------- | --- | -------------------------- |
| `pft-chat` | `supabase/functions/pft-chat` | No  | AI chatbot powered by Lovable AI |

---

## Design System

- **Colors:** Indian tricolor palette — Saffron, White, Green with Navy accents
- **Typography:** System fonts with clean hierarchy
- **Theme:** Light/dark mode via CSS custom properties (HSL tokens)
- **Components:** shadcn/ui with custom variants
- **Animations:** Framer Motion for page transitions and UI effects
- **Background:** Subtle Ashoka Chakra animation (TricolorBackground component)
