# School Management System (SMS) — PWA

A lightweight, offline-ready **School Management System Progressive Web App** built with **HTML, CSS, JavaScript, and Supabase**, hosted on **GitHub** and deployed on **Vercel**.

Designed for real school environments: fast, simple, mobile-first, and resilient on low bandwidth.

---

## Features

* Secure authentication (Supabase Auth)
* Student registration & listing
* Fee payment recording
* Role-ready structure (Admin / Bursar-ready)
* Offline support (Service Worker)
* Installable PWA (Android, Desktop)
* Zero-framework, easy to maintain

---

## Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Supabase (Postgres + Auth)
* **Hosting:** GitHub (repo) + Vercel (deployment)
* **PWA:** Web Manifest + Service Worker

---

## Project Structure

```
school-sms/
│
├── index.html
├── login.html
├── dashboard.html
├── fees.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── supabase.js
│   ├── auth.js
│   ├── students.js
│   └── fees.js
│
├── pwa/
│   ├── manifest.json
│   └── service-worker.js
│
├── assets/
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── vercel.json
└── README.md
```

---

## Getting Started

### 1️. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/school-sms.git
cd school-sms
```

---

### 2️. Create Supabase Project

1. Go to **[https://supabase.com](https://supabase.com)**
2. Create a new project
3. Copy:

   * Project URL
   * Public Anon Key

---

### 3️. Configure Supabase Client

Edit `js/supabase.js`:

```js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://YOUR_PROJECT_ID.supabase.co",
  "YOUR_PUBLIC_ANON_KEY"
);
```

---

## Database Schema

### Students Table

```sql
id uuid primary key default uuid_generate_v4(),
fullname text,
admission_no text,
class text,
created_at timestamp default now()
```

### Fees Table

```sql
id uuid primary key default uuid_generate_v4(),
student_id uuid references students(id),
amount numeric,
term text,
paid_at timestamp default now()
```

---

## PWA Setup

### `pwa/manifest.json`

Defines app name, icons, theme color, and install behavior.

### `pwa/service-worker.js`

Handles offline caching and fast reloads.

---

## Authentication

* Email + Password (Supabase Auth)
* Login page: `login.html`
* Protected pages redirect unauthenticated users

---

## Deployment (Vercel)

1. Push repository to GitHub
2. Go to **[https://vercel.com](https://vercel.com)**
3. Import GitHub project
4. Framework Preset: **Other**
5. Build Command: *(none)*
6. Output Directory: `/`

### `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Design Philosophy

* One page = one responsibility
* One script = one workflow
* Small system, strong foundation
* Built for African school realities

---

## Planned Enhancements

* Student fee balances
* PDF receipts & reports
* Role-based access (Admin / Teacher / Bursar)
* Offline IndexedDB sync
* SMS notifications
* Multi-school SaaS support

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

Built with intention for schools that need **clarity, speed, and trust**.

If you extend it, keep it simple. Systems grow best when their roots are clean.
